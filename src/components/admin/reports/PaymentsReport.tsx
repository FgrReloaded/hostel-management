"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Download, Calendar } from 'lucide-react'
import { Payment, Student } from "@prisma/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useRef } from 'react'

interface StudentWithPayments extends Student {
  status: string;
  amount: number;
  payments: Payment[];
}

interface PaymentsReportProps {
  paymentStatus: {
    status: string
    value: number
  }[]
  studentsWithStatus: StudentWithPayments[]
  revenueTrend: {
    month: string
    revenue: number
  }[]
}

export default function PaymentsReport({ revenueTrend, paymentStatus, studentsWithStatus }: PaymentsReportProps) {
  const COLORS = ["#078080", "#ff8e3c"]
  const reportRef = useRef<HTMLDivElement>(null)

  const paidStudents = studentsWithStatus?.filter(student => student.status === 'Paid')
  const unpaidStudents = studentsWithStatus?.filter(student => student.status === 'Unpaid')

  const today = new Date()
  const thisMonth = today.toLocaleString('default', { month: 'short' })
  const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const revenueTrendThisMonth = revenueTrend?.find((revenue: { month: string; revenue: number }) => revenue.month === thisMonth)?.revenue

  const handlePrint = async () => {
    const reportElement = reportRef.current;
    if (reportElement) {
      const canvas = await html2canvas(reportElement);
      const pdf = new jsPDF();

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const imgWidth = pageWidth - 2 * margin;

      let heightLeft = canvas.height;
      let position = 0;

      while (heightLeft > 0) {
        const canvasPage = document.createElement('canvas');
        const ctx = canvasPage.getContext('2d');

        canvasPage.width = canvas.width;
        canvasPage.height = Math.min(heightLeft, (pageHeight - 2 * margin) * canvas.width / imgWidth);

        ctx?.drawImage(
          canvas,
          0,
          position,
          canvas.width,
          canvasPage.height,
          0,
          0,
          canvas.width,
          canvasPage.height
        );

        const pageImgData = canvasPage.toDataURL('image/png');

        const currentImgHeight = (canvasPage.height * imgWidth) / canvas.width;
        pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, currentImgHeight);

        heightLeft -= canvasPage.height;
        position += canvasPage.height;

        if (heightLeft > 0) {
          pdf.addPage();
        }
      }

      pdf.save(`${thisMonth}-report.pdf`);
    }
  };


  return (
    <Card className="w-full max-w-6xl" ref={reportRef}>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary mb-2">100 Capacity Girls Hostel Monthly Report: {thisMonth}</CardTitle>
        <CardDescription className="text-lg flex items-center justify-center">
          <Calendar className="mr-2 h-5 w-5" />
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-primary/10 rounded-md">
          <div className="bg-primary/10 p-6 rounded-lg ml-4">
            <h3 className="text-xl font-semibold text-primary mb-2">Revenue for {thisMonth}</h3>
            <p className="text-4xl font-bold text-primary">₹{revenueTrendThisMonth?.toLocaleString('en-IN')}</p>
          </div>
          <ChartContainer
            config={{
              value: {
                label: "No of Students",
                color: "hsl(12, 50%, 20%)",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="status"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                    const RADIAN = Math.PI / 180
                    const radius = 25 + innerRadius + (outerRadius - innerRadius)
                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                    const y = cy + radius * Math.sin(-midAngle * RADIAN)
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={COLORS[index % COLORS.length]}
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {paymentStatus[index].status} ({value})
                      </text>
                    )
                  }}
                >
                  {paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Unpaid Students</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Name</TableHead>
                  <TableHead>Amount Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unpaidStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>₹{student.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Paid Students</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Name</TableHead>
                  <TableHead>Amount Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>₹{student.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Button variant="outline" onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <p className="text-sm text-muted-foreground">
            <a href="https://savitribaiphulebhawan.in" target="_blank" rel="noopener noreferrer" className="hover:underline">
              savitribaiphulebhawan.in
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}