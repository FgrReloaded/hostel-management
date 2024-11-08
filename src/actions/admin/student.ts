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

export async function updateRoom(id: string, roomNumber: string): Promise<{ error: boolean; msg: string }> {
  try {
    const session = await auth();

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        roomNumber: roomNumber,
      },
    });

    return { error: false, msg: "Room updated successfully" };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function updateAmount(amount: GLfloat) {
  try {

    await prisma.student.updateMany({
      data: {
        amountToPay: amount
      },
    });

    return { error: false, msg: "Amount updated successfully" };
  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}