import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"

const Complaints = () => {
  return (

    <Card>
    <CardHeader>
      <CardTitle>Student Complaints</CardTitle>
      <CardDescription>Manage and resolve student issues</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { id: 1, student: "John Doe", room: "A-101", issue: "Faulty AC", status: "Open" },
              { id: 2, student: "Jane Smith", room: "B-202", issue: "Noisy neighbors", status: "In Progress" },
              { id: 3, student: "Alice Johnson", room: "C-303", issue: "Leaky faucet", status: "Resolved" },
            ].map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.student}</TableCell>
                <TableCell>{complaint.room}</TableCell>
                <TableCell>{complaint.issue}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${complaint.status === "Open" ? "bg-red-100 text-red-800" :
                      complaint.status === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                    }`}>
                    {complaint.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>  )
}

export default Complaints