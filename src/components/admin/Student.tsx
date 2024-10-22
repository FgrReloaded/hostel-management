import React, { useMemo, useState } from 'react';
import { Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Payment, Student as StudentType } from "@prisma/client"
import { Separator } from "../ui/separator"

interface StudentWithPayments extends StudentType {
  payments: Payment[];
}

interface StudentProps {
  setActiveView: (view: string) => void;
  students: StudentWithPayments[]
  setSelectedStudent: (student: StudentWithPayments) => void;
}

const Student: React.FC<StudentProps> = ({ setActiveView, students, setSelectedStudent }) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const studentsWithStatus = useMemo(() => {
    return students.map(student => {
      const lastPayment = student.payments[0];
      const isPaid = lastPayment &&
        lastPayment.amount === 3500 &&
        lastPayment.month === currentMonth &&
        lastPayment.year === currentYear

      return {
        ...student,
        status: isPaid ? lastPayment.status : 'Unpaid',
        amount: lastPayment ? lastPayment.amount : 0
      };
    });
  }, [students]);

  const filteredStudents = useMemo(() => {
    return studentsWithStatus.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || student.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [studentsWithStatus, searchTerm, filterStatus]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Payment Details</CardTitle>
        <CardDescription>Manage and track student payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="relative flex-grow mr-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              onChange={handleSearchChange}
              value={searchTerm}
              placeholder="Search students"
              className="pl-8 w-full"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-5 w-5 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filterStatus} onValueChange={handleFilterChange}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="paid">Paid</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="unpaid">Unpaid</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Fees Paid</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents && filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${student.name}`} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>{student.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{student.roomNumber}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${student.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2 items-center">₹{student.amount}
                    <Button variant="outline" size="sm" onClick={() => { setSelectedPayment(student.payments[0]); setIsPaymentDialogOpen(true) }} >View</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                      setSelectedStudent(student)
                      setActiveView("studentProfile")
                    }}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <AlertDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold text-primary">Last Payment Details</AlertDialogTitle>
            <Separator className="my-4" />
            <AlertDialogDescription className="text-base">
              <div className="space-y-4">
                <InfoItem label="Date" value={selectedPayment?.createdAt ? new Date(selectedPayment.createdAt).toDateString() : 'N/A'} />
                <InfoItem label="Method" value={selectedPayment?.paymentMethod || 'N/A'} />
                <InfoItem label="Amount" value={String(selectedPayment?.amount)} />
                <InfoItem label="Verified" value={selectedPayment?.isVerified ? "Yes" : "No"} />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full sm:w-auto">Close</Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <span className="font-medium text-muted-foreground">{label}:</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}

export default Student