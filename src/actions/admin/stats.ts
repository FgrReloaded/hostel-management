"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";


export async function getPaymentStats(): Promise<{ error: boolean; msg: string; data?: { totalRevenue: number | null, pendingPayments: number, previousMonthsRevenue: number[] | null }
 }> {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const totalRevenue = await prisma.payment.aggregate({
      where: {
        amount: 3500,
        status: "Paid"
      },
      _sum: {
        amount: true
      }
    });

    const pendingPayments = await prisma.payment.count({
      where: {
        status: "Pending"
      }
    });

    const lastSixMonthsRevenue = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const start = new Date();
        start.setMonth(start.getMonth() - i);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);

        return prisma.payment.aggregate({
          where: {
            createdAt: {
              gte: start,
              lt: end
            },
            status: "Paid"
          },
          _sum: {
            amount: true
          }
        });
      })
    );

    const revenueByMonth = lastSixMonthsRevenue.map(result => result._sum.amount || 0);

    if (!totalRevenue || pendingPayments === null) {
      return { error: true, msg: "Something went wrong, please try again!" };
    }

    return {
      error: false,
      msg: "Stats retrieved",
      data: {
        totalRevenue: totalRevenue._sum.amount,
        previousMonthsRevenue: revenueByMonth,
        pendingPayments,
      }
    };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}