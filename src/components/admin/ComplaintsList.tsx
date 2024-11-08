import { getAllComplaints } from "@/actions/admin/complaints";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Complaint } from "@prisma/client";
import { useEffect, useState } from "react";

interface ComplaintWithStudent extends Complaint {
  student: {
    roomNumber: string | null;
  };
}

export default function Complaints() {
  const [complaints, setComplaints] = useState<ComplaintWithStudent[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const { data, msg, error } = await getAllComplaints();
      if (error) {
        console.error(msg);
        return;
      }
      if (data) {
        setComplaints(data);
      }
    })();
  }, []);

  // Filter complaints based on selected status and category
  const filteredComplaints = complaints.filter((complaint) => {
    return (
      (statusFilter === "all" || complaint.status === statusFilter) &&
      (categoryFilter === "all" || complaint.complaintCategory === categoryFilter)
    );
  });

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto ">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Complaints</h3>
                <p className="text-3xl font-semibold">{complaints?.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Open Complaints</h3>
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
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.status === 'Open' ? 'bg-red-100 text-red-800' :
                              complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                            }`}
                        >
                          {complaint.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(complaint?.createdAt).toDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
