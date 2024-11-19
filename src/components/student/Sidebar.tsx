import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import { CreditCard, FileText, Home, Menu, MessageSquare, User, X } from 'lucide-react'
import { ExitIcon } from '@radix-ui/react-icons'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Payment, RegistrationRequest, Student } from '@prisma/client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const Sidebar = ({
  activeView,
  setActiveView,
  studentInfo,
  registrationStatus,
  paymentHistory,
}: {
  activeView: string,
  setActiveView: (view: string) => void,
  studentInfo: Student | null,
  registrationStatus: RegistrationRequest | null,
  paymentHistory: Payment[],
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleViewChange = (view: string) => {
    setActiveView(view)
    router.push(`?view=${view}`, undefined);
    setIsOpen(false);
  }

  // Don't render until after mount
  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="md:hidden fixed top-2 left-2 z-30 p-2 bg-white rounded-full">
        <Menu className="h-5 w-5 cursor-pointer text-indigo-700" onClick={() => setIsOpen(true)} />
      </div>
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen || !isMobile ? 0 : -300 }}
        transition={{ duration: 0.5 }}
        className={`fixed md:relative w-64 h-screen bg-white shadow-lg z-40 ${isOpen ? "block" : "hidden md:block"}`}
      >
        <div className="md:hidden text-right absolute right-2 top-2 w-fit mb-2 rounded-full bg-gray-200 p-2">
          <X className="h-4 w-4 cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center">
            <Image src="/logo.webp" alt="Logo" width={100} height={100} objectFit="cover" />
            <h2 className="text-2xl text-center uppercase font-bold mb-6 mt-2 bg-clip-text text-transparent bg-gradient-to-tr from-purple-800 via-violet-600 to-indigo-800">Savitribai Phule Bhawan</h2>
          </div>
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
              </>
            }
            <Button className="w-full justify-start text-base font-medium py-6 px-4" onClick={() => signOut({
              redirectTo: "/"
            })}>
              Logout <ExitIcon className="ml-2 h-4 w-4" />
            </Button>
          </nav>
        </div>
      </motion.div>

      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </div>
  )
}

export default Sidebar