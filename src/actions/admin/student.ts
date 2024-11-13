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
    console.time("getAllStudents");
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

    console.timeEnd("getAllStudents");

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

export async function updateAmount(id: string, amount: GLfloat) {
  try {
    const session = await auth();

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
    });

    if (!student) {
      return { error: true, msg: "Student not found" };
    }

    await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        amountToPay: amount,
      },
    });


    return { error: false, msg: "Amount updated successfully" };
  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function updateFees(id: string, amount: GLfloat): Promise<{ error: boolean; msg: string }> {
  try {
    const session = await auth();

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
    });

    if (!student) {
      return { error: true, msg: "Student not found" };
    }

    await prisma.payment.create({
      data: {
        studentId: id,
        amount: amount,
        paymentMethod: "CASH",
        isVerified: true,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        status: "Paid",
      },
    });


    return { error: false, msg: "Fees updated successfully" };
  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}


export async function resetAmountToPay(id: string) {
  try {
    const session = await auth();

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
    });

    if (!student) {
      return { error: true, msg: "Student not found" };
    }

    await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        amountToPay: 3500,
      },
    });

    return { error: false, msg: "Amount reset successfully" };
  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}
