import { Home, Users, FileText, IndianRupee, UserPlus, MessageSquare, Settings, X, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { ExitIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { PaymentHistoryProps } from "@/lib/types";
import { useState } from "react";

const Sidebar = ({
  activeView,
  setActiveView,
  paymentHistory,
  countRegistrationRequest
}: {
  activeView: string,
  setActiveView: (view: string) => void,
  paymentHistory: PaymentHistoryProps[],
  countRegistrationRequest: number
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); 

  const handleViewChange = (view: string) => {
    setActiveView(view);
    router.push(`?view=${view}`, undefined);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="md:hidden  fixed top-2 left-2 z-30 p-2 bg-white rounded-full">
        <Menu className="h-5 w-5 cursor-pointer text-indigo-700" onClick={() => setIsOpen(true)} />
      </div>

      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen || !window.matchMedia("(max-width: 768px)").matches ? 0 : -300 }}
        transition={{ duration: 0.5 }}
        className={`fixed md:relative w-64 h-screen bg-white shadow-lg z-40 ${isOpen ? "block" : "hidden md:block"}`}
      >
        <div className="md:hidden text-right absolute right-2 top-2 w-fit mb-2 rounded-full bg-gray-200 p-2">
          <X className="h-4 w-4 cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>

        <div className="p-6">
          <h2 className="text-2xl text-center font-bold mb-6 mt-4 text-indigo-700">Savitribai Phule Bhawan</h2>
          <nav className="space-y-2">
            {[
              { icon: Home, label: "Overview", view: "overview" },
              { icon: Users, label: "Students", view: "students" },
              { icon: FileText, label: "Reports", view: "reports" },
              { icon: IndianRupee, label: "Payment History", view: "history" },
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
                {view === "request" && countRegistrationRequest > 0 &&
                  (
                    <span className="bg-red-500 text-white rounded-full px-2 p-1 font-extrabold text-xs ml-2">
                      {countRegistrationRequest}
                    </span>
                  )
                }
              </Button>
            ))}
            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={() => {
              signOut({ redirectTo: "/" });
              setIsOpen(false);
            }}>
              Logout <ExitIcon className="ml-2 h-4 w-4" />
            </Button>
          </nav>
        </div>
      </motion.div>

      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

export default Sidebar;
