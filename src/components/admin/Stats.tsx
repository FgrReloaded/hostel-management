"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Bell, Users, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { getPaymentStats } from "@/actions/admin/stats"
import { Payment, Student } from "@prisma/client"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StudentWithPayment extends Student {
  payments: Payment[]
}

const Stats = ({ students }: { students: StudentWithPayment[] }) => {
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    paidStudents: 0,
    unpaidStudents: 0,
  })

  const [revenueTrend, setRevenueTrend] = useState<{ month: string; revenue: number }[]>([])

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const studentsPaid = useMemo(() => {
    return students.filter(student => {
      const lastPayment = student.payments[0]
      return lastPayment &&
        lastPayment.amount === 3500 &&
        lastPayment.month === currentMonth &&
        lastPayment.year === currentYear
    }).length
  }, [students])

  useEffect(() => {
    (async () => {
      const { error, data } = await getPaymentStats()
      if (error) {
        console.error("Error fetching payment stats")
        return
      }

      if (!data) {
        return
      }

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
    })()
  }, [])

  const paymentStatusData = [
    { name: "Paid", value: studentsPaid },
    { name: "Unpaid", value: students.length - studentsPaid },
  ]

  const COLORS = ["#4F46E5", "#EF4444"]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Revenue", icon: DollarSign, value: `₹${overview.totalRevenue}`, description: "This month" },
          { title: "Pending Payments", icon: Bell, value: overview.pendingPayments, description: "Students with due payments" },
          { title: "Paid Students", icon: Users, value: studentsPaid, description: `Out of ${students.length}` },
          { title: "Unpaid Students", icon: AlertCircle, value: students.length - studentsPaid, description: "Requires attention" },
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              {paymentStatusData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Stats