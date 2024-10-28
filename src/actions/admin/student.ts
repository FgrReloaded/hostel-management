"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Student, Payment } from "@prisma/client";

interface StudentWithPayments extends Student {
  payments: Payment[];
}


export async function getAllStudents(): Promise<{ error: boolean; data?: StudentWithPayments[]; msg: string }> {
  try {
    const session = await auth();

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const students = await prisma.student.findMany({
      include: {
        payments: {
          orderBy: {
            createdAt: 'desc'
          },
        },
      },
    });

    if (!students.length) {
      return { error: false, msg: "No students found" };
    }



    return { error: false, msg: "Success", data: students };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}