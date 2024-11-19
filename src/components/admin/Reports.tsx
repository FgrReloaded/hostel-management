import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Payment, Student } from "@prisma/client"
import PaymentsReport from "@/components/admin/reports/PaymentsReport"


interface StudentWithPayments extends Student {
  status: string;
  amount: number;
  payments: Payment[];
}


interface ReportsProp {
  studentsWithStatus: StudentWithPayments[]
  revenueTrend: { month: string; revenue: number }[]
}


const Reports = ({ studentsWithStatus, revenueTrend }: ReportsProp) => {
  const downloadReport = (reportName: string) => {
    console.log(`Downloading ${reportName} report...`)
  }

  const paymentStatus = [
    { status: "Paid", value: studentsWithStatus.filter((student) => student.status === "Paid").length },
    { status: "Unpaid", value: studentsWithStatus.filter((student) => student.status === "Unpaid").length },
  ]

  return (
    <div className="space-y-8">
      <Tabs defaultValue="income">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income Report</CardTitle>
              <CardDescription>Track your monthly income trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  income: {
                    label: "Income",
                    color: "hsl(262, 80%, 50%)",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrend}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="hsl(262, 80%, 50%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => downloadReport("Income")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsReport revenueTrend={revenueTrend} studentsWithStatus={studentsWithStatus} paymentStatus={paymentStatus} />
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default Reports