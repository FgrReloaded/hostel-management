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


const History = ({ paymentHistory }: { paymentHistory: Payment[], studentRegistered: boolean | undefined }) => {
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
                    payment.ownerReceiptUrl ?
                      <a href={payment.ownerReceiptUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">View</a> : "NA"
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>)
}

export default History