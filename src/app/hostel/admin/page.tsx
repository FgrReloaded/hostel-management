"use client"

import { useEffect, useState } from "react"
import { AlertCircle, UserPlus, Bell, Home, Users, DollarSign, FileText, Settings, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react"
import { ExitIcon } from "@radix-ui/react-icons"
import Student from "@/components/admin/Student"
import Reports from "@/components/admin/Reports"
import PaymentHistory from "@/components/admin/PaymentHistory"
import Complaints from "@/components/student/Complaints"
import { Payment as PaymentType, Student as StudentType} from "@prisma/client"
import { getAllPayments } from "@/actions/payments/payment"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import RegistrationRequest from "@/components/admin/RegistrationRequests"
import { getAllStudents } from "@/actions/admin/student"


export default function OwnerDashboard() {
  const searchParams = useSearchParams()
  const [activeView, setActiveView] = useState("overview")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentType[]>([]);
  const [students, setStudents] = useState<StudentType[]>([]);
  const router = useRouter();


  const paymentOverview = {
    totalRevenue: 15000,
    pendingPayments: 5,
    paidStudents: 45,
    unpaidStudents: 5,
  }


  const monthlyIncome = [
    { month: "Jan", income: 14000 },
    { month: "Feb", income: 14500 },
    { month: "Mar", income: 15000 },
    { month: "Apr", income: 15000 },
    { month: "May", income: 15000 },
  ]


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
      if(!data) {
        return;
      }
      setPaymentHistory(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const {error, data} = await getAllStudents();
      if(error) {
        toast.error("Something went wrong");
        return;
      }
      if(!data) return;

      setStudents(data);

    })();
  }, []);


  const renderView = () => {
    switch (activeView) {
      case "overview":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Revenue", icon: DollarSign, value: `₹${paymentOverview.totalRevenue * 75}`, description: "This month" },
              { title: "Pending Payments", icon: Bell, value: paymentOverview.pendingPayments, description: "Students with due payments" },
              { title: "Paid Students", icon: Users, value: paymentOverview.paidStudents, description: `Out of ${paymentOverview.paidStudents + paymentOverview.unpaidStudents}` },
              { title: "Unpaid Students", icon: AlertCircle, value: paymentOverview.unpaidStudents, description: "Requires attention" },
            ].map((item, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-indigo-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-700">{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      case "students":
        return (
          <Student setActiveView={setActiveView} students={students} setSelectedStudent={setSelectedStudent}  />
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
        return <RegistrationRequest paymentHistory={paymentHistory} />
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
                  <CardDescription>Room {selectedStudent.room}</CardDescription>
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
                  <p className="font-semibold text-indigo-700">Payment Status</p>
                  <p>{selectedStudent.status}</p>
                </div>
                <div>
                  <p className="font-semibold text-indigo-700">Amount</p>
                  <p>₹{selectedStudent.amount}</p>
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
        return null
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
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">Hostel Management</h2>
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
                {label}
              </Button>
            ))}
            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={()=>{signOut({
              redirectTo: "/"
            })}}>
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