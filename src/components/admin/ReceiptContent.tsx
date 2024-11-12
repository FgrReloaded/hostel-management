import { Payment } from "@prisma/client";

interface PaymentHistoryProps extends Payment {
  student: {
    name: string;
    id: string;
  }
}

export default function ReceiptContent({ payment }: { payment: PaymentHistoryProps }) {
  console.log(payment);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Hostel Payment Receipt</h2>
        <p className="text-gray-600">Receipt #{parseInt(String(payment.id))}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="font-semibold">Student Details:</h3>
          <p>Name: {payment.student.name}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold">Payment Details:</h3>
          <p>Amount: ₹{payment.amount}</p>
          <p>Date: {new Date(payment.createdAt).toDateString()}</p>
          <p>Status: {payment.status}</p>
        </div>
      </div>
      <div className="border-t pt-4">
        <p className="text-center text-sm text-gray-600">
          Thank you for your payment. This is an official receipt for your records.
        </p>
      </div>
    </div>
  )
}