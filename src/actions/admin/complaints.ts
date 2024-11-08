"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Complaint } from "@prisma/client";

// interface complain with student roomNumber

interface ComplaintWithStudent extends Complaint {
  student: {
    roomNumber: string | null;
  }
}

export async function getAllComplaints(): Promise<{ error: boolean; data?: ComplaintWithStudent[]; msg: string }> {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const complaints = await prisma.complaint.findMany({
      include: {
        student: {
          select: {
            roomNumber: true,
          }
        }
      }
    });

    return {
      error: false,
      data: complaints,
      msg: "Complaints",
    }
  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function createComplaint(category: string, description: string): Promise<{ error: boolean; msg: string, data?: Complaint }> {
  try {
    const session = await auth();
    if (!session) {
      return { error: true, msg: "Unauthorized" };
    }

    const complaint = await prisma.complaint.create({
      data: {
        studentId: session.user.id,
        complaintCategory: category,
        complaintText: description,
      }
    })

    return {
      error: false,
      data: complaint,
      msg: "Complaint submitted",
    }
  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}