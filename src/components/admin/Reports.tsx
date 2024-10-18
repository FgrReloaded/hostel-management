import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "../ui/button"
import { Download } from "lucide-react"

const Reports = ({monthlyIncome}) => {
  return (
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
          <BarChart data={monthlyIncome.map(item => ({ ...item, income: item.income * 75 }))}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="income" fill="hsl(262, 80%, 50%)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex justify-end mt-4">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
    </CardContent>
  </Card>
  )
}

export default Reports