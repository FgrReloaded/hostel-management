"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { PaymentMode } from "@/lib/types";
import { PaymentMethod } from "@prisma/client";



export async function getPaymentMethods(): Promise<{ error: boolean; msg: string; data?: PaymentMethod[] }> {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const paymentMethods = await prisma.paymentMethod.findMany();
    return { error: false, msg: "Payment methods retrieved", data: paymentMethods };
  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}


export async function upsertPaymentMethod(data: PaymentMode): Promise<{ error: boolean; msg: string; }> {
  try {
    const session = await auth();

    if (!data.type) {
      return { error: true, msg: "Invalid data" };
    }

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const mode = data.type;

    if (mode === "UPI") {
      if (!data.upiId || !data.beneficiaryName) {
        return { error: true, msg: "Invalid data" };
      }
    } else if (mode === "NETBANKING") {
      if (!data.accountNumber || !data.ifsc || !data.bankName || !data.beneficiaryName) {
        return { error: true, msg: "Invalid data" };
      }
    } else if (mode === "QR") {
      if (!data.qrcode) {
        return { error: true, msg: "Invalid data" };
      }
    }

    const existingMethod = await prisma.paymentMethod.findFirst({
      where: { type: data.type }
    });

    if (existingMethod) {
      await prisma.paymentMethod.update({
        where: { id: existingMethod.id },
        data
      });
      return { error: false, msg: "Payment method updated" };
    } else {
      await prisma.paymentMethod.create({
        data
      });
      return { error: false, msg: "Payment method added" };
    }

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function handleActiveStatus(id: string): Promise<{ error: boolean; msg: string; }> {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const method = await prisma.paymentMethod.findFirst({
      where: { id }
    });

    if (!method) {
      return { error: true, msg: "Method not found" };
    }

    await prisma.paymentMethod.update({
      where: { id },
      data: {
        isActive: !method.isActive
      }
    });

    return { error: false, msg: "Method updated" };
  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}