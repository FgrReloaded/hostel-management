"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Payment } from "@prisma/client";

interface PaymentInterface {
  paymentMethod: string;
  screenshotImageUrl: string;
  amount: number;
  referrenceNo: string;
}
interface PaymentHistoryProps extends Payment {
  student: {
    name: string;
    id: string;
  }
}


export async function getAllPayments(): Promise<{ error: boolean; msg: string; data?: PaymentHistoryProps[] }> {
  try {
    const session = await auth();

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const payments = await prisma.payment.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!payments) {
      return { error: true, msg: "No payments found" };
    }

    return { error: false, msg: "Success", data: payments };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function getPayments(): Promise<{ error: boolean; msg: string; data?: Payment[] }> {
  try {
    const session = await auth();

    if (!session) {
      return { error: true, msg: "Unauthorized" };
    }

    const payments = await prisma.payment.findMany({
      where: {
        studentId: session?.user.id,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!payments) {
      return { error: true, msg: "No payments found" };
    }

    return { error: false, msg: "Success", data: payments };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function createNewPayment({
  paymentMethod,
  screenshotImageUrl,
  amount,
  referrenceNo
}: PaymentInterface): Promise<{ error: boolean; msg: string; }> {
  try {
    const session = await auth();

    if (!session) {
      return { error: true, msg: "Unauthorized" };
    }

    if (amount === 6000) {
      await prisma.payment.create({
        data: {
          studentId: session?.user.id,
          paymentMethod,
          screenshotImageUrl,
          amount,
          referrenceNo
        }
      });
      return { error: false, msg: "Payment uploaded" };
    } else {
      await prisma.payment.create({
        data: {
          studentId: session?.user.id,
          paymentMethod,
          screenshotImageUrl,
          amount,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          referrenceNo,
        }
      });
      return { error: false, msg: "Payment uploaded" }
    }

  }
  catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function updatePaymentStatus(id: bigint, status: string, room: string): Promise<{ error: boolean; msg: string; }> {
  try {
    const session = await auth();

    if (!id || !status) {
      return { error: true, msg: "Invalid data" };
    }

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id
      }
    });

    if (!payment) {
      return { error: true, msg: "Payment not found" };
    }
    if (payment.amount === 6000) {
      if (!room) {
        return { error: true, msg: "Room number is required" };
      }

      await prisma.student.update({
        where: {
          id: payment.studentId
        },
        data: {
          isRegistered: true,
          roomNumber: room
        }
      });
    }

    const isVerified = status === "Paid" ? true : false;

    await prisma.payment.update({
      where: {
        id
      },
      data: {
        status,
        isVerified
      }
    });


    return { error: false, msg: "Payment status updated" };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}
