import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Payment } from "@prisma/client"
import { Download, Printer } from "lucide-react"
import { Button } from "../ui/button"
import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ReceiptContent from "../admin/ReceiptContent"
import { useUserProfile } from "@/hooks/useUserProfile"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'



interface PaymentHistoryProps extends Payment {
  student: {
    name: string
    id: string
  }
}

const History = ({ paymentHistory }: { paymentHistory: Payment[], studentRegistered: boolean | undefined }) => {
  const [isReceiptShow, setIsReceiptShow] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryProps | null>(null)
  const receiptRef = useRef<HTMLDivElement | null>(null)
  const { userProfile: studentInfo } = useUserProfile();


  const handlePrint = async () => {
    const receiptElement = receiptRef.current
    if (receiptElement) {
      const canvas = await html2canvas(receiptElement)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      pdf.save('receipt.pdf')
    }
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400 text-white rounded-t-lg">
        <CardTitle className="text-2xl">Payment History</CardTitle>
        <CardDescription className="text-purple-100">Your recent payments</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentHistory?.map((payment, index) => (
              <TableRow key={index} className="hover:bg-gray-100 transition-colors">
                <TableCell>{new Date(payment.createdAt).toDateString()} {new Date(payment.createdAt).toLocaleTimeString()}</TableCell>
                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${payment.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>                  {payment.status}
                  </span>
                </TableCell>
                <TableCell>
                  {
                    payment.status === "Paid" &&
                    <Button onClick={() => {
                      setIsReceiptShow(true)
                      setSelectedPayment({ ...payment, student: { name: studentInfo?.name || "", id: studentInfo?.id || "" } })
                    }} variant="outline" className="mr-2">
                      <Download size={20} />
                    </Button>}
                </TableCell>
              </TableRow>
            ))}
            {
              paymentHistory.length === 0 &&
              <TableRow>
                <TableCell colSpan={5} className="text-center">No payments found</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </CardContent>

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
    </Card>)
}

export default History