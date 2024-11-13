'use client'

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Complaint } from "@prisma/client"
import { getAllComplaints, updateComplaintStatus } from "@/actions/admin/complaints"
import { toast } from "sonner"

interface ComplaintWithStudent extends Complaint {
  student: {
    roomNumber: string | null
  }
}

export default function Complaints() {
  const [complaints, setComplaints] = useState<ComplaintWithStudent[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    const { data, msg, error } = await getAllComplaints()
    if (error) {
      console.error(msg)
      return
    }
    if (data) {
      setComplaints(data)
    }
  }

  const updateStatus = async (complaintId: bigint, newStatus: string) => {
    const { error, msg } = await updateComplaintStatus(complaintId, newStatus);

    if (error) {
      return;
    }
    setComplaints((prev) => {
      return prev.map((complaint) => {
        if (complaint.id === complaintId) {
          return {
            ...complaint,
            status: newStatus
          }
        }
        return complaint;
      })
    });
    toast.success(msg);



  }

  const filteredComplaints = complaints.filter((complaint) => {
    return (
      (statusFilter === "all" || complaint.status === statusFilter) &&
      (categoryFilter === "all" || complaint.complaintCategory === categoryFilter)
    )
  })

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Complaints Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Complaints</h3>
                <p className="text-3xl font-semibold">{complaints?.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Pending Complaints</h3>
                <p className="text-3xl font-semibold">{complaints.filter(c => c.status === 'Pending').length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
                <p className="text-3xl font-semibold">{complaints?.filter(c => c.status === 'In Progress').length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Closed Complaints</h3>
                <p className="text-3xl font-semibold">{complaints?.filter(c => c.status === 'Closed').length}</p>
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-4">
              <Select onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setCategoryFilter(value)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleanliness">Cleanliness</SelectItem>
                  <SelectItem value="noise">Noise</SelectItem>
                  <SelectItem value="amenities">Amenities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint, idx) => (
                    <TableRow key={complaint.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{complaint?.student.roomNumber}</TableCell>
                      <TableCell>{complaint.complaintCategory}</TableCell>
                      <TableCell>{complaint.complaintText}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.status === 'Pending' ? 'bg-red-100 text-red-800' :
                              complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                            }`}
                        >
                          {complaint.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(complaint?.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select
                          onValueChange={(value) => updateStatus(complaint.id, value)}
                          defaultValue={complaint.status}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}