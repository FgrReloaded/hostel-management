import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

const Complaints = () => {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400 text-white rounded-t-lg">
        <CardTitle className="text-2xl">File a Complaint</CardTitle>
        <CardDescription className="text-red-100">Let us know if you&apos;re facing any issues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="complaint-type">Complaint Type</Label>
          <Select>
            <SelectTrigger id="complaint-type" className="w-full">
              <SelectValue placeholder="Select complaint type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="noise">Noise</SelectItem>
              <SelectItem value="cleanliness">Cleanliness</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="complaint-description">Description</Label>
          <Textarea id="complaint-description" placeholder="Describe your issue here..." className="min-h-[100px]" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-gradient-to-tr from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
          Submit Complaint
        </Button>
      </CardFooter>
    </Card>
    )
}

export default Complaints