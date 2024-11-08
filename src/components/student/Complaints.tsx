'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createComplaint } from '@/actions/student/complaints'
import { Complaint } from '@prisma/client'

const formSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500, { message: "Description must not exceed 500 characters" }),
})


export default function ComplaintsManager({ complaints, setComplaints }: { complaints: Complaint[], setComplaints: (complaints: Complaint[]) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userProfile } = useUserProfile()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      category: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const { data, msg, error } = await createComplaint(values.category, values.description);

    if (error) {
      setIsSubmitting(false)
      return toast.error(msg)
    }
    if (data) {
      setComplaints([...complaints, data])
    }
    setIsSubmitting(false)
    toast.success("Complaint Submitted")
    form.reset()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Complaints Management</CardTitle>
          <CardDescription>Submit new complaints or view your existing ones</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">New Complaint</TabsTrigger>
              <TabsTrigger value="view">View My Complaints</TabsTrigger>
            </TabsList>
            <TabsContent value="new">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <Input disabled value={userProfile?.roomNumber ?? "Not Assigned"} />
                    <FormMessage />
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="cleanliness">Cleanliness</SelectItem>
                            <SelectItem value="noise">Noise</SelectItem>
                            <SelectItem value="amenities">Amenities</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose the category that best describes your complaint</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide details about your complaint"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Describe your complaint in detail (max 500 characters)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="view">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No.</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    complaints.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No complaints found</TableCell>
                      </TableRow>
                    )
                  }
                  {complaints.map((complaint, idx) => (
                    <TableRow key={complaint.id}>
                      <TableCell>{idx+1}</TableCell>
                      <TableCell>{complaint.complaintCategory}</TableCell>
                      <TableCell>{complaint.complaintText}</TableCell>
                      <TableCell>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.status === 'Open' ? 'bg-red-100 text-red-800' :
                          complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                          {complaint.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(complaint?.createdAt).toDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            Your complaints will be reviewed by our staff and addressed as soon as possible.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}