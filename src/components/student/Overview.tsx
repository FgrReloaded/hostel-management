import { IndianRupee, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { toast } from "sonner"
import { createRegistrationRequest } from "@/actions/student/registration"
import { Payment, RegistrationRequest, Student } from "@prisma/client"

interface OverviewProps {
  studentInfo: Student | null
  setActiveView: (view: string) => void
  registrationStatus: RegistrationRequest | null
  paymentHistory: Payment[]
}


const Overview = ({ studentInfo, setActiveView, registrationStatus, paymentHistory }: OverviewProps) => {

  const registerUser = async () => {
    if (!studentInfo?.profileSetup) {
      toast.error("Please setup your profile first");
      setActiveView("profile");
      return;
    }
    const { error, msg } = await createRegistrationRequest();

    if (error) {
      toast.error(msg);
      return;
    }
    toast.success("Registration request sent successfully");
  }

  const monthlyPaid = paymentHistory[0]?.amount === 3500 && paymentHistory[0]?.status === "Paid" && paymentHistory[0]?.month === new Date().getMonth() + 1 && paymentHistory[0]?.year === new Date().getFullYear();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader className="bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Welcome, {studentInfo?.name}</CardTitle>
          <CardDescription className="text-purple-100">Here&apos;s your hostel stay overview</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-gray-500">Room Number</span>
              <span className="text-2xl font-bold">{studentInfo?.roomNumber ?? "Not Assigned"}</span>
            </div>
            {
              studentInfo?.isRegistered ?
                <>
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-500">Monthly Rent</span>
                    ₹3500
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-500">Next Payment Due</span>
                    <span className="text-2xl font-bold">
                      {
                        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toDateString()
                      }
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-500">Monthly Fee</span>
                    <Badge variant="default" className="w-fit">
                      {monthlyPaid ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </> :
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium text-gray-500">Registration Status</span>
                  <Badge variant="default" className="w-fit">
                    {registrationStatus ? registrationStatus?.status : "Not Registered"}
                  </Badge>
                  {
                    !registrationStatus &&
                    <Button onClick={registerUser} className="w-fit bg-gradient-to-tr from-violet-400 to-violet-500 hover:from-violet-500 hover:to-violet-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                      Register Now
                    </Button>
                  }
                  {
                    registrationStatus?.status === "APPROVED" &&
                    <div className="flex flex-col gap-1">
                      <span className="text-green-700 font-semibold text-lg">Your registration request has been approved</span>
                      { paymentHistory.length === 0 ?
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 font-bold text-lg">Pay the registration fee to get your room assigned.</span>
                          <Button
                            onClick={() => setActiveView("payment")}
                            className="w-fit font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <IndianRupee className="mr-2 h-5 w-5" />
                            Make Payment
                          </Button>
                        </div>:
                        <div className="flex items-center gap-2">
                          <span className=" text-black font-bold text-xl">Payment details uploaded. Please wait for confirmation.</span>
                        </div>
                      }
                    </div>
                  }
                </div>
            }

          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            onClick={() => setActiveView("payment")}
            className="w-full bg-gradient-to-tr from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <IndianRupee className="mr-2 h-5 w-5" />
            Make Payment
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveView("complaints")}
            className="w-full border-2 border-purple-500 text-purple-500 font-bold py-3 rounded-lg transition-all duration-300 hover:bg-purple-500 hover:text-white transform hover:scale-105"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            File a Complaint
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <Badge variant="default" className="bg-blue-500">New</Badge>
              <span>Maintenance work scheduled for next week</span>
            </li>
            <li className="flex items-center space-x-3">
              <Badge variant="outline">Info</Badge>
              <span>Hostel meeting on Friday at 6 PM</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default Overview