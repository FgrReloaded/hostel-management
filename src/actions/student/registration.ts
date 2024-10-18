"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { RegistrationRequest, RequestStatus } from "@prisma/client";


export async function getAllRegistrationRequests(): Promise<{ error: boolean; msg: string; data?: RegistrationRequest[] }> {
  try {
    const session = await auth();

    if (!session && session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const requests = await prisma.registrationRequest.findMany({
      include: {
        student: {
          include: {
            parent: true,
          },
        }
      }
    });

    if (!requests) {
      return { error: true, msg: "No requests found" };
    }

    return { error: false, msg: "Success", data: requests };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!"};
  }
}

export async function getRegistrationStatus(): Promise<{ error: boolean; msg: string; data?: RegistrationRequest | null }> {
  try {
    const session = await auth();

    if (!session) {
      return { error: true, msg: "Unauthorized" };
    }

    const existingRequest = await prisma.registrationRequest.findFirst({
      where: {
        studentId: session?.user.id,
      },
    });

    return { error: false, msg: "Success", data: existingRequest };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!"};
  }
}

export async function createRegistrationRequest(): Promise<{ error: boolean; msg: string }> {
  try {
    const session = await auth();


    if (!session) {
      return { error: true, msg: "Unauthorized" };
    }

    const existingRequest = await prisma.registrationRequest.findFirst({
      where: {
        studentId: session?.user.id,
      },
    });

    if (existingRequest) {
      return { error: true, msg: "Registration request already sent." };
    }

    await prisma.registrationRequest.create({
      data: {
        studentId: session?.user.id,
      },
    });

    return { error: false, msg: "Request created successfully" };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function updateRegistrationRequest(id: string, status: RequestStatus): Promise<{ error: boolean; msg: string }> {
  try {
    const session = await auth();

    if (!session && session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const request = await prisma.registrationRequest.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return { error: false, msg: "Request updated successfully" };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}