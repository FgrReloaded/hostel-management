"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import Overview from "@/components/student/Overview"
import Payment from "@/components/student/Payment"
import History from "@/components/student/History"
import Profile from "@/components/student/Profile"
import Complaints from "@/components/student/Complaints"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Complaint, Payment as PaymentType, RegistrationRequest } from "@prisma/client"
import { toast } from "sonner"
import { getRegistrationStatus } from "@/actions/student/registration"
import { getPayments } from "@/actions/payments/payment"
import OverViewSkeleton from "@/components/student/Skeleton/OverViewSkeleton"
import { getComplaints } from "@/actions/student/complaints"
import Sidebar from "@/components/student/Sidebar"

export default function StudentDashboard() {
  const searchParams = useSearchParams()
  const [activeView, setActiveView] = useState("overview")
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationRequest | null>(null);
  const { userProfile: studentInfo } = useUserProfile();
  const [paymentHistory, setPaymentHistory] = useState<PaymentType[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    (async () => {
      const { error, data } = await getPayments();
      setIsLoading(false);
      if (error) {
        toast.error("Failed to fetch payment history");
        return;
      }
      if (!data) {
        return;
      }
      setPaymentHistory(data);
    })();
  }, [])

  useEffect(() => {
    (async () => {
      const { error, msg, data } = await getComplaints();
      if (error) {
        toast.error(msg);
        return;
      }
      if (data) {
        setComplaints(data);
      }
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
      setIsLoading(false);
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


  const renderView = () => {
    if (isLoading || !studentInfo) {
      return <OverViewSkeleton />
    }
    switch (activeView) {
      case "overview":
        return (
          <Overview studentInfo={studentInfo} setActiveView={setActiveView} registrationStatus={registrationStatus} paymentHistory={paymentHistory} />
        )
      case "payment":
        return (
          <Payment studentInfo={studentInfo!} />
        )
      case "history":
        return (
          <History paymentHistory={paymentHistory} studentRegistered={studentInfo?.isRegistered} />
        )
      case "profile":
        return (
          <Profile studentInfo={studentInfo!} />
        )
      case "complaints":
        return (
          <Complaints setComplaints={setComplaints} complaints={complaints} />
        )
      case "how-to-use":
        return (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-600">This is a guide on how to use the student portal</p>
            <div className="rounded-xl mt-8">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/YEvp0dhQ3Kk?si=bns-VShrwvYIwY7n" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
          </div>
          )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setActiveView={setActiveView} activeView={activeView} studentInfo={studentInfo} registrationStatus={registrationStatus} paymentHistory={paymentHistory} />
      <div className="flex-1 md:px-8 px-4 py-16 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="md:text-4xl text-2xl whitespace-nowrap text-center font-extrabold absolute left-1/2 -translate-x-1/2  -top-12 text-indigo-800">Student Portal</h2>
          <h1 className="md:text-4xl text-xl font-bold mb-6 text-gray-800">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
          {
            studentInfo && !studentInfo?.profileSetup &&
            <Alert variant={"destructive"} className="mb-4" >
              <AlertTitle className="font-bold uppercase">Incomplete Profile !</AlertTitle>

              <AlertDescription className="flex items-center justify-between">
                <span>
                  Your profile is incomplete, please complete your profile to continue
                </span>
                <Button onClick={() => setActiveView("profile")} variant="default" className="ml-4">
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