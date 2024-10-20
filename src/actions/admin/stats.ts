"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";


export async function getPaymentStats(): Promise<{ error: boolean; msg: string; data?: { totalRevenue: number | null, pendingPayments: number }
 }> {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }


    const totalRevenue = await prisma.payment.aggregate({
      _sum: {
        amount: true
      }
    });

    console.log(totalRevenue);

    const pendingPayments = await prisma.payment.count({
      where: {
        status: "Pending"
      }
    });

    console.log(pendingPayments);

    if (!totalRevenue || pendingPayments === null) {
      return { error: true, msg: "Something went wrong, please try again!" };
    }


    return {
      error: false,
      msg: "Stats retrieved",
      data: {
        totalRevenue: totalRevenue._sum.amount,
        pendingPayments,
      }
    };



  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}