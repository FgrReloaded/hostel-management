import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { getAllRegistrationRequests, updateRegistrationRequest } from '@/actions/student/registration';
import { RegistrationRequest as RegistrationRequestType, RequestStatus, Student, Parent } from '@prisma/client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Separator } from '../ui/separator';

const RegistrationRequest = () => {
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequestType[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false);

  const updateRequest = async (id: string, type: RequestStatus) => {
    const { error, msg } = await updateRegistrationRequest(id, type);

    if (error) {
      toast.error(msg);
    } else {
      toast.success(msg);
      const updatedRequests = registrationRequests.map(request => {
        if (request.id === id) {
          return {
            ...request,
            status: type
          }
        }
        return request;
      });
      setRegistrationRequests(updatedRequests);
    }
  }

  const openStudentDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentDialogOpen(true);
  }

  const openParentDialog = (parent: Parent) => {
    setSelectedParent(parent);
    setIsParentDialogOpen(true);
  }

  useEffect(() => {
    (async () => {
      const { error, data, msg } = await getAllRegistrationRequests();
      if (error) {
        toast.error(msg);
      } else {
        if (data) {
          setRegistrationRequests(data);
        }
      }
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Request</CardTitle>
        <CardDescription>View all new registration requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student Details</TableHead>
                <TableHead>Parent Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationRequests && registrationRequests?.map((registrationRequest: RegistrationRequestType) => (
                <TableRow key={registrationRequest.id}>
                  <TableCell>{new Date(registrationRequest?.createdAt).toDateString()} {new Date(registrationRequest?.createdAt).toLocaleTimeString()}</TableCell>
                  <TableCell className='flex gap-2 items-center'>{registrationRequest?.student?.name}
                    <Button onClick={() => openStudentDialog(registrationRequest.student)} variant="outline" className="mr-2">
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => openParentDialog(registrationRequest.student.parent)} variant="outline" className="mr-2">
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${registrationRequest?.status === "PENDING" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}>
                      {registrationRequest?.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {
                      registrationRequest?.status === "PENDING" &&
                      <>
                        <Button onClick={() => updateRequest(registrationRequest?.id, "REJECTED")} variant="outline" className="mr-2">
                          <X size={20} />
                        </Button>
                        <Button onClick={() => updateRequest(registrationRequest?.id, "APPROVED")} variant="outline" className="mr-2">
                          <Check size={20} />
                        </Button>
                      </>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold text-primary">Student Details</AlertDialogTitle>
            <Separator className="my-4" />
            <AlertDialogDescription className="text-base">
              <div className="space-y-4">
                <InfoItem label="Name" value={selectedStudent?.name} />
                <InfoItem label="Email" value={selectedStudent?.email} />
                <InfoItem label="Phone" value={selectedStudent?.phone} />
                <InfoItem label="Room Number" value={selectedStudent?.roomNumber || 'Not assigned'} />
                <InfoItem label="Address" value={selectedStudent?.address || 'Not provided'} />
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

      <AlertDialog open={isParentDialogOpen} onOpenChange={setIsParentDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold text-primary">Parent Details</AlertDialogTitle>
            <Separator className="my-4" />
            <AlertDialogDescription className="text-base">
              <div className="space-y-4">
                <InfoItem label="Name" value={selectedParent?.name} />
                <InfoItem label="Email" value={selectedParent?.email} />
                <InfoItem label="Phone" value={selectedParent?.phone} />
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


export default RegistrationRequest;