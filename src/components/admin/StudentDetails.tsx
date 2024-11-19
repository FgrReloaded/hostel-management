import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OctagonAlert, Pencil } from "lucide-react"
import { Button } from "../ui/button"
import { Payment, Student } from "@prisma/client";
import { resetAmountToPay } from "@/actions/admin/student";
import { toast } from "sonner";
import { sendReminderEmail } from "@/actions/mail/payment";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface StudentWithPayments extends Student {
  status: string;
  amount: number;
  payments: Payment[];
}


const StudentDetails = ({
  selectedStudent,
  setIsRoomDialogOpen,
  setIsFeeAmountDialogOpen,
  showPaymentHistory,
  setIsFeesPaid
}: {
  selectedStudent: StudentWithPayments,
  setIsRoomDialogOpen: (value: boolean) => void,
  setIsFeeAmountDialogOpen: (value: boolean) => void,
  showPaymentHistory: () => void,
  setIsFeesPaid: (value: boolean) => void
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openBlacklist, setOpenBlacklist] = useState(false);


  const resetAmount = async () => {
    const { error, msg } = await resetAmountToPay(selectedStudent.id);
    if (error) {
      return;
    }
    toast.success(msg);
    selectedStudent.amountToPay = 3500;
  }

  const sendReminder = async () => {
    try {
      setIsLoading(true);
      const { data, error, msg } = await sendReminderEmail(selectedStudent);

      console.log(data, error, msg)
      if (error) {
        console.log(error)
      }
      toast.success(msg);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  const blackListStudent = async () => {
    console.log("Blacklisting student")
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedStudent.name}`} alt={selectedStudent.name} />
            <AvatarFallback>{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <CardTitle className="text-2xl flex gap-4 items-center justify-between w-full mb-2">
              <span>
                {selectedStudent.name}
              </span>
              <Button
                onClick={() => setOpenBlacklist(true)}
              variant="outline" className="text-sm ml-auto border border-red-600 text-red-600 hover:text-red-500 hover:bg-red-100" size={"sm"}>
                <OctagonAlert /> Remove
              </Button>
            </CardTitle>
            <CardDescription className="flex gap-2 items-center">
              Room <span className="font-semibold text-gray-900">{selectedStudent.roomNumber ? selectedStudent?.roomNumber?.split("/")[0] + ' / ' + selectedStudent?.roomNumber?.split("/")[1] : "Not Assigned"}</span>
              {
                selectedStudent?.roomNumber && <span>
                  <Pencil onClick={() => { setIsRoomDialogOpen(true) }} className="h-4 w-4 text-gray-500 ml-2 cursor-pointer" />
                </span>
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-indigo-700">Email</p>
            <p>{selectedStudent.email}</p>
          </div>
          <div>
            <p className="font-semibold text-indigo-700">Phone</p>
            <p>{selectedStudent.phone}</p>
          </div>
          <div>
            <p className="font-semibold text-indigo-700">Course</p>
            <p>{selectedStudent.course}</p>
          </div>
          <div>
            <p className="font-semibold text-indigo-700">College</p>
            <p>{selectedStudent.college}</p>
          </div>
          <div>
            <p className="font-semibold text-indigo-700">Registration Status</p>
            <p>{selectedStudent.isRegistered ? 'Registered' : 'Not Registered'}</p>
          </div>
          <div>
            <p className="font-semibold text-indigo-700">Monthly Paid</p>
            <p className="flex gap-2 items-center">
              {selectedStudent.status === "Paid" ? 'Paid' : 'Not Paid'}
              {
                selectedStudent.status !== "Paid" &&
                <span>
                  <Pencil onClick={() => { setIsFeesPaid(true) }} className="h-4 w-4 text-gray-500 ml-2 cursor-pointer" />
                </span>
              }
            </p>
          </div>

          <div>
            <p className="font-semibold text-indigo-700">Fees to be paid</p>
            <p className="flex gap-2 items-center">₹ {selectedStudent.amountToPay}
              {
                selectedStudent.amountToPay !== 3500 && selectedStudent.status !== "Paid" &&
                <span onClick={resetAmount} className="cursor-pointer text-[0.65rem] text-gray-700 bg-gray-200 rounded-lg border border-gray-100 py-1 px-2">
                  Reset
                </span>
              }
              {
                selectedStudent.status !== "Paid" &&
                <span>
                  <Pencil onClick={() => { setIsFeeAmountDialogOpen(true) }} className="h-4 w-4 text-gray-500 ml-2 cursor-pointer" />
                </span>
              }
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {
            selectedStudent.status !== "Paid" &&
            <Button onClick={sendReminder} className="w-full bg-indigo-600 hover:bg-indigo-700">{
              isLoading ? 'Sending...' : 'Send Payment Reminder'
            }</Button>
          }
          <Button onClick={showPaymentHistory} variant="outline" className="w-full">View Payment History</Button>
        </div>
      </CardContent>
      <AlertDialog open={openBlacklist} onOpenChange={setOpenBlacklist}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Blacklist Student</AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                Are you sure you want to blacklist this student
              </p>
              <div className="flex justify-end mt-4">
                <AlertDialogCancel onClick={() => setIsFeesPaid(false)} className="mr-2">Cancel</AlertDialogCancel>
                <Button onClick={blackListStudent} variant="destructive">Confirm</Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default StudentDetails