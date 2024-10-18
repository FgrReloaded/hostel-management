"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, FileText, Home, MessageSquare, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { cn } from "@/lib/utils"
import Overview from "@/components/student/Overview"
import Payment from "@/components/student/Payment"
import History from "@/components/student/History"
import Profile from "@/components/student/Profile"
import Complaints from "@/components/student/Complaints"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Payment as PaymentType, RegistrationRequest } from "@prisma/client"
import { toast } from "sonner"
import { getRegistrationStatus } from "@/actions/student/registration"
import { getPayments } from "@/actions/payments/payment"
import { signOut } from "next-auth/react"
import { ExitIcon } from "@radix-ui/react-icons"

export default function StudentDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeView, setActiveView] = useState("overview")
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationRequest | null>(null);
  const { userProfile: studentInfo } = useUserProfile();
  const [paymentHistory, setPaymentHistory] = useState<PaymentType[]>([]);

  useEffect(() => {
    (async () => {
      const { error, data } = await getPayments();
      if (error) {
        toast.error("Failed to fetch payment history");
        return;
      }
      if(!data) {
        return;
      }
      setPaymentHistory(data);
    })();
  }, [])


  useEffect(() => {
    const view = searchParams.get("view")
    if (view) {
      setActiveView(view)
    }

    if (studentInfo?.isRegistered) {
      return;
    }
    (async () => {
      const { error, data } = await getRegistrationStatus();
      if (error) {
        toast.error("Failed to fetch registration status");
        return;
      }
      if (data) {
        setRegistrationStatus(data);
      }
    }
    )();
  }, [searchParams])

  const handleViewChange = (view: string) => {
    setActiveView(view)
    router.push(`?view=${view}`, undefined)
  }

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return (
          <Overview studentInfo={studentInfo} setActiveView={handleViewChange} registrationStatus={registrationStatus} paymentHistory={paymentHistory} />
        )
      case "payment":
        return (
          <Payment studentInfo={studentInfo} />
        )
      case "history":
        return (
          <History paymentHistory={paymentHistory} studentRegistered={studentInfo?.isRegistered} />
        )
      case "profile":
        return (
          <Profile studentInfo={studentInfo} />
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
    <div className="flex h-screen bg-gray-100">
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400">Student Portal</h2>
          <nav className="space-y-3">
            <Button
              variant={activeView === "overview" ? "default" : "ghost"}
              className={cn("w-full justify-start text-base font-medium py-6 px-4", activeView === "overview" && "bg-blue-100 text-blue-800 hover:bg-blue-200")}
              onClick={() => handleViewChange("overview")}
            >
              <Home className="mr-2 h-5 w-5" />
              Overview
            </Button>
            {
              (studentInfo?.isRegistered || registrationStatus) &&
              <Button
                variant={activeView === "payment" ? "default" : "ghost"}
                className={cn("w-full justify-start text-base font-medium py-6 px-4", activeView === "payment" && "bg-blue-100 text-blue-800 hover:bg-blue-200")}
                onClick={() => handleViewChange("payment")}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Make Payment
              </Button>
            }
            {
              paymentHistory &&
              <Button
                variant={activeView === "history" ? "default" : "ghost"}
                className={cn("w-full justify-start text-base font-medium py-6 px-4", activeView === "history" && "bg-blue-100 text-blue-800 hover:bg-blue-200")}
                onClick={() => handleViewChange("history")}
              >
                <FileText className="mr-2 h-5 w-5" />
                Payment History
              </Button>
            }
            <Button
              variant={activeView === "profile" ? "default" : "ghost"}
              className={cn("w-full justify-start text-base font-medium py-6 px-4", activeView === "profile" && "bg-blue-100 text-blue-800 hover:bg-blue-200")}
              onClick={() => handleViewChange("profile")}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </Button>
            {
              studentInfo?.isRegistered &&
              <>
                <Button
                  variant={activeView === "complaints" ? "default" : "ghost"}
                  className={cn("w-full justify-start text-base font-medium py-6 px-4", activeView === "complaints" && "bg-blue-100 text-blue-800 hover:bg-blue-200")}
                  onClick={() => handleViewChange("complaints")}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  File Complaint
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start text-base font-medium py-6 px-4", activeView === "settings" && "bg-blue-100 text-blue-800 hover:bg-blue-200")}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Button>
              </>
            }
                <Button className="w-full justify-start text-base font-medium py-6 px-4" onClick={()=>signOut({
                  redirectTo: "/"
                })}>
                  Logout <ExitIcon className="ml-2 h-4 w-4" />
                </Button>
          </nav>
        </div>
      </motion.div>

      <div className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-800">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
          {
            !studentInfo?.profileSetup &&
            <Alert variant={"destructive"} className="mb-4" >
              <AlertTitle className="font-bold uppercase">Incomplete Profile !</AlertTitle>

              <AlertDescription className="flex items-center justify-between">
                <span>
                  Your profile is incomplete, please complete your profile to continue
                </span>
                <Button onClick={() => handleViewChange("profile")} variant="default" className="ml-4">
                  Complete Profile
                </Button>
              </AlertDescription>
            </Alert>
          }

          {renderView()}
        </motion.div>
      </div>
    </div>
  )
}