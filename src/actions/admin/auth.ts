"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

interface Admin {
  email: string;
  password: string;
  name: string;
}


export async function getAdmin(): Promise<{ error: boolean; msg: string }> {
  try {
    const admin = await prisma.hostelStaff.findFirst();

    if (!admin) {
      return { error: true, msg: "No admin found" };
    }

    return { error: false, msg: "Success"};

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }

}

export async function createAdmin(User: Admin): Promise<{ error: boolean; msg: string }> {
  try {
    const { email, password, name } = User;
    const session = await auth();

    if (!email || !password || !name) {
      return { error: true, msg: "Invalid credentials" };
    }

    const admin = await prisma.hostelStaff.findFirst();

    if (admin) {
      if(session && session?.user.role !== "ADMIN") {
        return { error: true, msg: "Unauthorized" };
      }
    }


    const existingUser = await prisma.hostelStaff.findFirst({
      where: {
        email
      },
    });

    if (existingUser) {
      return { error: true, msg: "Admin with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.hostelStaff.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { error: false, msg: "Admin created successfully" };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

