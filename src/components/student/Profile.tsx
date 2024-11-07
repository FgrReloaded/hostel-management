import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchParentInfo, updateStudentProfile } from '@/actions/student/student';
import { Student } from '@prisma/client';

const Profile = ({ studentInfo }: { studentInfo: Student }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [editableInfo, setEditableInfo] = useState({
    address: '',
    category: '',
    parent: {
      name: '',
      email: '',
      phone: '',
    }
  });
  const [parentInfo, setParentInfo] = useState({ name: '', email: '', phone: '' });

  const [canEdit, setCanEdit] = useState({
    address: false,
    category: false,
    parent: false
  });

  useEffect(() => {
    (async () => {
      const info = await fetchParentInfo();

      setParentInfo(info);
      setCanEdit({
        address: !studentInfo?.address,
        category: !studentInfo?.category,
        parent: !info.name || !info.phone
      });
    })();
  }, [studentInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, isParentField = false) => {
    if (isParentField) {
      setEditableInfo(prev => ({
        ...prev,
        parent: {
          ...prev.parent,
          [field]: e.target.value
        }
      }));
    } else {
      setEditableInfo(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setEditableInfo(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    (e.target as HTMLButtonElement).textContent = "Saving...";
    await updateStudentProfile({
      address: editableInfo.address,
      category: editableInfo.category,
      parent: editableInfo.parent
    });
    window.location.reload();
    setIsEditing(false);
  };

  const isAnyFieldEditable = canEdit.address || canEdit.parent;

  const categories = [
    { value: "general", label: "General" },
    { value: "obc", label: "OBC" },
    { value: "sc-st", label: "SC/ST" },
  ];


  return (
    <Card>
      <CardHeader className="bg-gradient-to-tr from-purple-400 via-violet-400 to-indigo-400 text-white rounded-t-lg">
        <CardTitle className="text-2xl">Student Profile</CardTitle>
        <CardDescription className="text-yellow-100">Your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
              {studentInfo?.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{studentInfo?.name}</h3>
              <p className="text-lg text-gray-500">Room: {studentInfo?.roomNumber ?? "Not Assigned"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={studentInfo?.email} readOnly className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={studentInfo?.phone} readOnly className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={canEdit.address ? (isEditing ? editableInfo.address : '') : studentInfo?.address || ''}
                onChange={(e) => handleInputChange(e, 'address')}
                readOnly={!canEdit.address || !isEditing}
                className={canEdit.address && isEditing ? "" : "bg-gray-100"}
                placeholder={canEdit.address ? "Enter your address" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              {canEdit.category && isEditing ? (
                <Select
                  value={editableInfo.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={
                    categories.find((category) => category.value === studentInfo?.category?.toLowerCase())?.label
                    || ''}
                  readOnly
                  className="bg-gray-100"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Registration Status</Label>
              <Input value={studentInfo?.isRegistered ? 'Registered' : 'Not Registered'} readOnly className="bg-gray-100" />
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-bold mb-4">Parent Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Parent Name</Label>
                <Input
                  value={canEdit.parent ? (isEditing ? editableInfo.parent.name : '') : parentInfo?.name}
                  onChange={(e) => handleInputChange(e, 'name', true)}
                  readOnly={!canEdit.parent || !isEditing}
                  className={canEdit.parent && isEditing ? "" : "bg-gray-100"}
                  placeholder={canEdit.parent ? "Enter parent's name" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Email</Label>
                <Input
                  value={canEdit.parent ? (isEditing ? editableInfo.parent.email : '') : parentInfo?.email}
                  onChange={(e) => handleInputChange(e, 'email', true)}
                  readOnly={!canEdit.parent || !isEditing}
                  className={canEdit.parent && isEditing ? "" : "bg-gray-100"}
                  placeholder={canEdit.parent ? "Enter parent's email" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Phone</Label>
                <Input
                  value={canEdit.parent ? (isEditing ? editableInfo.parent.phone : '') : parentInfo?.phone}
                  onChange={(e) => handleInputChange(e, 'phone', true)}
                  readOnly={!canEdit.parent || !isEditing}
                  className={canEdit.parent && isEditing ? "" : "bg-gray-100"}
                  placeholder={canEdit.parent ? "Enter parent's phone" : ""}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isAnyFieldEditable && (
          isEditing ? (
            <>
              <Button onClick={handleSave} variant="default" className="w-fit mr-2 flex border-2 border-green-500 bg-green-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:bg-green-600 hover:border-green-600 transform hover:scale-105">
                Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="w-fit flex border-2 border-red-500 text-red-500 font-bold py-3 rounded-lg transition-all duration-300 hover:bg-red-500 hover:text-white transform hover:scale-105">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="w-fit ml-auto flex border-2 border-orange-500 text-orange-500 font-bold py-3 rounded-lg transition-all duration-300 hover:bg-orange-500 hover:text-white transform hover:scale-105">
              {canEdit.address && canEdit.parent ? "Complete Profile" : "Edit Information"}
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  )
}

export default Profile