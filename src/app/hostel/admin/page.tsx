"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Student from "@/components/admin/Student"
import Reports from "@/components/admin/Reports"
import PaymentHistory from "@/components/admin/PaymentHistory"
import Complaints from "@/components/admin/ComplaintsList"
import { Payment as PaymentType, Student as StudentType, RegistrationRequest as RegistrationRequestType, Parent } from "@prisma/client"
import { getAllPayments } from "@/actions/payments/payment"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import RegistrationRequest from "@/components/admin/RegistrationRequests"
import { getAllStudents, updateAmount, updateFees, updateRoom } from "@/actions/admin/student"
import SettingsPage from "@/components/admin/Settings"
import Stats from "@/components/admin/Stats"
import { getPaymentStats } from "@/actions/admin/stats"
import { StatsSkeleton } from "@/components/admin/skeletons/StatsSkeleton"
import { getAllRegistrationRequests } from "@/actions/student/registration"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from "@/components/ui/input"
import StudentDetails from "@/components/admin/StudentDetails"
import { PaymentHistoryProps } from "@/lib/types"
import Sidebar from "@/components/admin/Sidebar"


interface StudentWithPayments extends StudentType {
  status: string;
  amount: number;
  payments: PaymentType[];
}

interface RegistrationRequestTypeWithStudent extends RegistrationRequestType {
  student: {
    parent: Parent | null;
  } & StudentType
}




export default function OwnerDashboard() {
  const searchParams = useSearchParams()
  const [activeView, setActiveView] = useState("overview")
  const [selectedStudent, setSelectedStudent] = useState<StudentWithPayments | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryProps[]>([]);
  const [students, setStudents] = useState<StudentWithPayments[]>([]);
  const [countRegistrationRequest, setCountRegistrationRequest] = useState(0);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isFeeAmountDialogOpen, setIsFeeAmountDialogOpen] = useState(false);
  const [isFeesPaid, setIsFeesPaid] = useState(false);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [assignedRoom, setAssignedRoom] = useState<string | null>(null);
  const [dayPresent, setDayPresent] = useState<number>(0);
  const router = useRouter();
  const [overview, setOverview] = useState<{
    totalRevenue: number;
    pendingPayments: number;
    paidStudents: number;
    unpaidStudents: number;
  }>({
    totalRevenue: 0,
    pendingPayments: 0,
    paidStudents: 0,
    unpaidStudents: 0,
  })
  const [revenueTrend, setRevenueTrend] = useState<{ month: string; revenue: number }[]>([])
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequestTypeWithStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const currentDate = useMemo(() => new Date(), [])
  const currentMonth = useMemo(() => currentDate.getMonth() + 1, [currentDate])
  const currentYear = useMemo(() => currentDate.getFullYear(), [currentDate])

  const studentsWithStatus = useMemo(() => {
    return students.map(student => {
      const lastPayment = student.payments[0]
      const isPaid = lastPayment &&
        lastPayment.amount === student.amountToPay &&
        lastPayment.month === currentMonth &&
        lastPayment.year === currentYear
      return {
        ...student,
        status: isPaid ? lastPayment.status : 'Unpaid',
        amount: lastPayment ? lastPayment.amount : 0
      }
    }, [students, currentMonth, currentYear])
  }, [students, currentMonth, currentYear])


  const studentsPaid = useMemo(() => studentsWithStatus.filter(s => s.status === "Paid").length, [studentsWithStatus]) as number

  useEffect(() => {
    const view = searchParams.get("view")
    if (view) {
      setActiveView(view)
    }

  }, [searchParams])



  useEffect(() => {
    (async () => {
      const { error, data, msg } = await getAllPayments();
      if (error) {
        toast.error(msg);
        return;
      }
      if (!data) {
        return;
      }
      setPaymentHistory(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { error, data } = await getAllStudents();
      if (error) {
        return;
      }
      if (!data) return;
      // @ts-expect-error-ignore
      setStudents(data);

    })();
  }, []);

  useEffect(() => {
    const fetchPaymentStats = async () => {
      try {
        const { error, data } = await getPaymentStats()
        if (error) {
          console.error("Error fetching payment stats")
          return
        }

        if (data) {
          setOverview(prev => ({
            ...prev,
            totalRevenue: data.totalRevenue || 0,
            pendingPayments: data.pendingPayments || 0,
          }))

          setRevenueTrend((data?.previousMonthsRevenue ?? []).map((revenue: number, index: number) => ({
            month: new Date(currentDate.getFullYear(), currentDate.getMonth() - index).toLocaleString('default', { month: 'short' }),
            revenue
          })).reverse())
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchPaymentStats()
  }, [])

  useEffect(() => {
    (async () => {
      const { error, data, msg } = await getAllRegistrationRequests();
      if (error) {
        toast.error(msg);
      } else {
        if (data) {
          setRegistrationRequests(data);
          const pendingRequests = data.filter(request => request.status === "PENDING");
          setCountRegistrationRequest(pendingRequests.length);
        }
      }
    })();
  }, []);

  const showPaymentHistory = () => {
    setActiveView("history");
    router.push(`?view=history&id=${selectedStudent?.id}`, undefined)
  }

  useEffect(() => {
    if (selectedStudent) {
      setAssignedRoom(selectedStudent.roomNumber);
    }
  }, [selectedStudent]);

  const changeRoom = async () => {
    if (!assignedRoom) {
      toast.error("Please enter a room number");
      return;
    }
    if (!selectedStudent) {
      return;
    }

    const { error, msg } = await updateRoom(selectedStudent?.id, assignedRoom!);

    if (error) {
      toast.error(msg);
    } else {
      setStudents(prev => {
        const updatedStudents = prev.map(student => {
          if (student.id === selectedStudent?.id) {
            student.roomNumber = assignedRoom;
          }
          return student;
        });
        return updatedStudents;
      });
      setSelectedStudent(prev => {
        if (prev) {
          prev.roomNumber = assignedRoom;
        }
        return prev;
      });
      toast.success(msg);
      setIsRoomDialogOpen(false);
    }
  }

  const changeAmount = async () => {
    if (!dayPresent) {
      toast.error("Please enter the day student was present in the hostel");
      return;
    }
    if (!selectedStudent) {
      return;
    }

    const { error, msg } = await updateAmount(selectedStudent?.id, dayPresent * 200);

    if (error) {
      toast.error(msg);
    } else {
      setStudents(prev => {
        const updatedStudents = prev.map(student => {
          if (student.id === selectedStudent?.id) {
            student.amountToPay = dayPresent * 200;
          }
          return student;
        });
        return updatedStudents;
      });
      setSelectedStudent(prev => {
        if (prev) {
          prev.amountToPay = dayPresent * 200;
        }
        return prev;
      });
      toast.success(msg);
      setIsFeeAmountDialogOpen(false);
    }
  }

  const updateFeesAmount = async () => {
    if (!amountPaid) {
      toast.error("Please enter the amount paid by the student");
      return;
    }
    if (!selectedStudent) {
      return;
    }
    const { error, msg } = await updateFees(selectedStudent?.id, amountPaid);

    if (error) {
      toast.error(msg);
    } else {
      toast.success(msg);
      setIsFeesPaid(false);
      window.location.reload();
    }
  }

  const renderView = () => {
    if (isLoading) {
      return <StatsSkeleton />
    }
    switch (activeView) {
      case "overview":
        return (
          <Stats studentsPaid={studentsPaid} students={students} overview={overview} revenueTrend={revenueTrend} />
        )
      case "students":
        return (
          <Student setActiveView={setActiveView} studentsWithStatus={studentsWithStatus} setSelectedStudent={setSelectedStudent} />
        )
      case "reports":
        return (
          <Reports />
        )
      case "history":
        return (
          <PaymentHistory paymentHistory={paymentHistory} />
        )
      case "request":
        return <RegistrationRequest setCountRegistrationRequest={setCountRegistrationRequest} registrationRequests={registrationRequests} setRegistrationRequests={setRegistrationRequests} />
      case "studentProfile":
        if (!selectedStudent) return null
        return (
          <StudentDetails setIsFeesPaid={setIsFeesPaid} selectedStudent={selectedStudent} showPaymentHistory={showPaymentHistory} setIsRoomDialogOpen={setIsRoomDialogOpen} setIsFeeAmountDialogOpen={setIsFeeAmountDialogOpen} />
        )
      case "complaints":
        return (
          <Complaints />
        )
      default:
        return <SettingsPage />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} paymentHistory={paymentHistory} countRegistrationRequest={countRegistrationRequest} />

      <div className="flex-1 md:p-8 px-4 py-12 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-indigo-800">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
          {renderView()}
        </motion.div>
      </div>
      <AlertDialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Proof</AlertDialogTitle>
            <AlertDialogDescription>
              <p>Please assign a room to this student?</p>
              <div className="mt-4">
                <Input onChange={(e) => { setAssignedRoom(e.target.value) }} value={assignedRoom ?? ""} placeholder="Room Number / Floor" type='text' />
              </div>
              <div className="flex justify-end mt-4">
                <AlertDialogCancel onClick={() => setIsRoomDialogOpen(false)} className="mr-2">Cancel</AlertDialogCancel>
                <Button onClick={changeRoom} variant="outline">Approve</Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isFeeAmountDialogOpen} onOpenChange={setIsFeeAmountDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Fees Amount</AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                Please enter the day student was present in the hostel
              </p>
              <div className="mt-4">
                <Input max={10} onChange={(e) => { setDayPresent(parseInt(e.target.value)) }} value={dayPresent ?? 0} placeholder="No of days present" type='number' />
              </div>
              <div className="flex justify-end mt-4">
                <AlertDialogCancel onClick={() => setIsFeeAmountDialogOpen(false)} className="mr-2">Cancel</AlertDialogCancel>
                <Button onClick={changeAmount} variant="outline">Update</Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isFeesPaid} onOpenChange={setIsFeesPaid}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Fees Status</AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                Please enter the amount paid by student
              </p>
              <div className="mt-4">
                <Input onChange={(e) => { setAmountPaid(parseInt(e.target.value)) }} value={amountPaid ?? 0} placeholder="Amount paid" type='number' />
              </div>
              <div className="flex justify-end mt-4">
                <AlertDialogCancel onClick={() => setIsFeesPaid(false)} className="mr-2">Cancel</AlertDialogCancel>
                <Button onClick={updateFeesAmount} variant="outline">Update</Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}