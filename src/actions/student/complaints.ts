"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Complaint } from "@prisma/client";


export async function getComplaints(): Promise<{ error: boolean; data?: Complaint[]; msg: string }> {
  try {
    const session = await auth();
    if (!session) {
      return { error: true, msg: "Unauthorized" };
    }

    const complaints = await prisma.complaint.findMany({
      where: {
        studentId: session.user.id,
      },
    })

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