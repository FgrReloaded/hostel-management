'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CldImage } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Check, Download, Eye, Printer, X } from "lucide-react"
import { updatePaymentStatus } from "@/actions/payments/payment"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Payment } from '@prisma/client'
import { StudentSkeleton } from './skeletons/StudentSkeleton'
import { useSearchParams } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ReceiptContent from './ReceiptContent'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentHistoryProps extends Payment {
  student: {
    name: string
    id: string
  }
}

interface ImageUrlType {
  public_id: string
  secure_url: string
}

const PaymentHistory = ({ paymentHistory }: { paymentHistory: PaymentHistoryProps[] }) => {
  const [payments, setPayments] = useState(paymentHistory)
  const [selectedImage, setSelectedImage] = useState({
    imageUrl: [] as ImageUrlType[],
    referrenceNo: ""
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<bigint | null>(null)
  const [assignedRoom, setAssignedRoom] = useState<string | null>(null)
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryProps | null>(null)
  const [isReceiptShow, setIsReceiptShow] = useState(false)
  const searchParams = useSearchParams()
  const receiptRef = useRef<HTMLDivElement | null>(null)

  const [monthFilter, setMonthFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const updatePayment = async (id: bigint, type: string) => {
    type = type === "approve" ? "Paid" : "Rejected"
    const { error, msg } = await updatePaymentStatus(id, type, assignedRoom!)

    if (error) {
      toast.error(msg)
    } else {
      toast.success(msg)
      const updatedPayments = payments.map((payment) => {
        if (payment.id === BigInt(id)) {
          payment.status = type
        }
        return payment
      })
      setIsRoomDialogOpen(false)
      setPayments(updatedPayments)
    }
  }

  const openImageDialog = (imageUrl: [], referrenceNo?: string) => {
    setSelectedImage({
      imageUrl,
      referrenceNo: referrenceNo || ""
    })
    setIsDialogOpen(true)
  }

  const openRoomDialog = (id: bigint, amount: number) => {
    if (amount !== 6000) {
      updatePayment(id, "approve")
      return
    }
    setSelectedRoom(id)
    setIsRoomDialogOpen(true)
  }

  useEffect(() => {
    if (paymentHistory) {
      setPayments(paymentHistory)
    }
    if (searchParams) {
      const search = searchParams.get('id')
      if (search) {
        const filteredPayments = paymentHistory?.filter(payment => payment.studentId === search)
        setIsFilterApplied(true)
        setPayments(filteredPayments)
      }
    }
  }, [paymentHistory, searchParams])

  const clearFilter = () => {
    setPayments(paymentHistory)
    setIsFilterApplied(false)
    setMonthFilter("all")
    setStatusFilter("all")
  }

  const handlePrint = async () => {
    const receiptElement = receiptRef.current
    if (receiptElement) {
      const canvas = await html2canvas(receiptElement)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      pdf.save(`${selectedPayment?.student.name}-receipt.pdf`)
    }
  }

  const applyFilters = () => {
    let filteredPayments = paymentHistory

    if (monthFilter !== "all") {
      filteredPayments = filteredPayments.filter(payment => {
        const paymentDate = new Date(payment.createdAt)
        return paymentDate.getMonth() === parseInt(monthFilter) - 1
      })
    }

    if (statusFilter !== "all") {
      filteredPayments = filteredPayments.filter(payment => payment.status === statusFilter)
    }

    setPayments(filteredPayments)
    setIsFilterApplied(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View all past transactions</CardDescription>
        <div className="flex flex-wrap gap-4 mt-4">
          <Select onValueChange={setMonthFilter} value={monthFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={applyFilters}>Apply Filters</Button>
          {isFilterApplied && <Button onClick={clearFilter} variant="outline">Clear Filters</Button>}
        </div>
        {isFilterApplied && (
          <p className="text-sm text-green-700 mt-2">
            Showing filtered payment history
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Payment Proof</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory === null && <StudentSkeleton />}
              {paymentHistory && paymentHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No payment history found
                  </TableCell>
                </TableRow>
              )}
              {payments && payments.slice().reverse().map((payment: PaymentHistoryProps) => (
                <TableRow key={payment.id.toString()}>
                  <TableCell>{new Date(payment.createdAt).toDateString()} {new Date(payment.createdAt).toLocaleTimeString()}</TableCell>
                  <TableCell>{payment.student.name}</TableCell>
                  <TableCell>₹{payment.amount}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell >
                    {/* @ts-expect-error-ignore */}
                    {payment?.screenshotImageUrl?.length > 0 ? (
                      <CldImage
                        // @ts-expect-error-ignore
                        src={payment?.screenshotImageUrl?.[0]?.public_id || ""}
                        alt="Payment Proof"
                        width={50}
                        height={50}
                        className="object-cover rounded-lg cursor-pointer"
                      />
                    )
                      : (
                        "No proof provided"
                      )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${payment.status === "Paid" ? "bg-green-100 text-green-800" :
                      payment.status === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.status === "Pending" && (
                      <>
                        <Button onClick={() => updatePayment(payment.id, "reject")} variant="outline" className="mr-2">
                          <X size={20} />
                        </Button>
                        <Button onClick={() => openRoomDialog(payment.id, payment.amount)} variant="outline" className="mr-2">
                          <Check size={20} />
                        </Button>
                      </>
                    )}
                    <Button onClick={() => openImageDialog(
                      // @ts-expect-error-ignore
                      payment.screenshotImageUrl!,
                      payment.referrenceNo || ""
                    )} variant="outline" className="mr-2">
                      <Eye size={20} />
                    </Button>
                    {payment.status === "Paid" && (
                      <Button onClick={() => {
                        setIsReceiptShow(true)
                        setSelectedPayment(payment)
                      }} variant="outline" className="mr-2">
                        <Download size={20} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Proof</AlertDialogTitle>
            <AlertDialogDescription className='flex flex-col gap-4 items-center justify-center'>
              <div className='flex gap-4 my-2 md:w-full w-4/5 justify-center '>
                {
                  selectedImage.imageUrl.map((image, idx) => {
                    return (
                      <CldImage
                        key={idx}
                        src={image.public_id}
                        alt="Payment Proof"
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    )
                  }
                  )
                }
              </div>

              <p className="text-gray-600 w-full border-b border-gray-200 pb-4">
                Referrence No: {selectedImage.referrenceNo}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Room</AlertDialogTitle>
            <AlertDialogDescription>
              <p>Please assign a room to this student</p>
              <div className="mt-4">
                <Input onChange={(e) => setAssignedRoom(e.target.value)} placeholder="Room Number / Floor" type="text" />
              </div>
              <div className="flex justify-end mt-4">
                <AlertDialogCancel onClick={() => setIsRoomDialogOpen(false)} className="mr-2">Cancel</AlertDialogCancel>
                <Button onClick={() => updatePayment(selectedRoom!, "approve")} variant="outline">Approve</Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isReceiptShow} onOpenChange={() => setIsReceiptShow(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div ref={receiptRef}>
              <ReceiptContent payment={selectedPayment} />
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print as PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PaymentHistory