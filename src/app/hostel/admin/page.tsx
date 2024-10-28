"use client"

import { useEffect, useMemo, useState } from "react"
import { UserPlus, Home, Users, DollarSign, FileText, Settings, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { ExitIcon } from "@radix-ui/react-icons"
import Student from "@/components/admin/Student"
import Reports from "@/components/admin/Reports"
import PaymentHistory from "@/components/admin/PaymentHistory"
import Complaints from "@/components/student/Complaints"
import { Payment as PaymentType, Student as StudentType, RegistrationRequest as RegistrationRequestType, Parent } from "@prisma/client"
import { getAllPayments } from "@/actions/payments/payment"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import RegistrationRequest from "@/components/admin/RegistrationRequests"
import { getAllStudents } from "@/actions/admin/student"
import SettingsPage from "@/components/admin/Settings"
import Stats from "@/components/admin/Stats"
import { getPaymentStats } from "@/actions/admin/stats"
import { StatsSkeleton } from "@/components/admin/skeletons/StatsSkeleton"
import { getAllRegistrationRequests } from "@/actions/student/registration"

interface PaymentHistoryProps extends PaymentType {
  student: {
    name: string;
    id: string;
  }
}

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
  const router = useRouter();
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    paidStudents: 0,
    unpaidStudents: 0,
  })
  const [revenueTrend, setRevenueTrend] = useState<{ month: string; revenue: number }[]>([])
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequestTypeWithStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const monthlyIncome = [
    { month: "Jan", income: 14000 },
    { month: "Feb", income: 14500 },
    { month: "Mar", income: 15000 },
    { month: "Apr", income: 15000 },
    { month: "May", income: 15000 },
  ]


  const currentDate = useMemo(() => new Date(), [])
  const currentMonth = useMemo(() => currentDate.getMonth() + 1, [currentDate])
  const currentYear = useMemo(() => currentDate.getFullYear(), [currentDate])

  const studentsWithStatus = useMemo(() => {
    return students.map(student => {
      const lastPayment = student.payments[0]
      const isPaid = lastPayment &&
        lastPayment.amount === 3500 &&
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

  const handleViewChange = (view: string) => {
    setActiveView(view)
    router.push(`?view=${view}`, undefined)
  }

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
        toast.error("Something went wrong");
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

          setRevenueTrend([
            { month: "Jan", revenue: 42000 },
            { month: "Feb", revenue: 45000 },
            { month: "Mar", revenue: 48000 },
            { month: "Apr", revenue: 51000 },
            { month: "May", revenue: 53000 },
            { month: "Jun", revenue: 56000 },
          ])
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
          <Reports monthlyIncome={monthlyIncome} />
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
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedStudent.name}`} alt={selectedStudent.name} />
                  <AvatarFallback>{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{selectedStudent.name}</CardTitle>
                  <CardDescription>Room {selectedStudent?.roomNumber}</CardDescription>
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
                  <p className="font-semibold text-indigo-700">Registration Status</p>
                  <p>{selectedStudent.isRegistered ? 'Registered' : 'Not Registered'}</p>
                </div>
                <div>
                  <p className="font-semibold text-indigo-700">Fees</p>
                  <p>₹ 3500</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Send Payment Reminder</Button>
                <Button variant="outline" className="w-full">View Payment History</Button>
              </div>
            </CardContent>
          </Card>
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
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">SBP Bhawan</h2>
          <nav className="space-y-2">
            {[
              { icon: Home, label: "Overview", view: "overview" },
              { icon: Users, label: "Students", view: "students" },
              { icon: FileText, label: "Reports", view: "reports" },
              { icon: DollarSign, label: "Payment History", view: "history" },
              { icon: UserPlus, label: "Request", view: "request" },
              { icon: MessageSquare, label: "Complaints", view: "complaints" },
              { icon: Settings, label: "Settings", view: "settings" },
            ].map(({ icon: Icon, label, view }) => (
              <Button
                key={view}
                variant={activeView === view ? "default" : "ghost"}
                className={`w-full justify-start ${activeView === view ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700' : ''}`}
                onClick={() => handleViewChange(view)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label} {view === "history" && paymentHistory.filter(p => p.status === "Pending").length > 0 &&
                  (
                    <span className="bg-red-500 text-white rounded-full px-2 p-1 font-extrabold text-xs ml-2">
                      {paymentHistory.filter(p => p.status === "Pending").length}
                    </span>
                  )
                }
                {
                  view === "request" && countRegistrationRequest > 0 &&
                  (
                    <span className="bg-red-500 text-white rounded-full px-2 p-1 font-extrabold text-xs ml-2">
                      {countRegistrationRequest}
                    </span>
                  )
                }
              </Button>
            ))}
            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={() => {
              signOut({
                redirectTo: "/"
              })
            }}>
              Logout <ExitIcon className="ml-2 h-4 w-4" />
            </Button>
          </nav>
        </div>
      </motion.div>

      <div className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-indigo-800">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
          {renderView()}
        </motion.div>
      </div>
    </div>
  )
}