"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { Student } from "@prisma/client";

interface User {
  email: string;
  password: string;
  name: string;
  phone: string;
}


export async function getProfile(): Promise<{ error: boolean; data?: Student; msg: string }> {
  try {
    const session = await auth();
    const user = await prisma.student.findFirst({
      where: {
        id: session?.user.id,
      },
    })

    if (!user) {
      return { error: true, msg: "User not found" };
    }

    return {
      error: false,
      data: user,
      msg: "User found",
    }

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }

}

export async function createUser(User: User): Promise<{ error: boolean; msg: string }> {
  try {
    const { email, password, name, phone } = User;

    if (!email || !password || !name) {
      return { error: true, msg: "Invalid credentials" };
    }

    const existingUser = await prisma.student.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone }
        ],
      },
    });

    if (existingUser) {
      return { error: true, msg: "Email or Phone number already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.student.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    return { error: false, msg: "User created successfully" };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function updateStudentProfile(
  { address, category, course, college, parent }: { address: string; category: string, course: string, college: string, parent: { name: string; email: string; phone: string } }
): Promise<{ error: boolean; msg: string }> {
  try {
    const session = await auth();

    if (!session) {
      return { error: true, msg: "Unauthorized" };
    }
    console.log(address, category, course, college)
    await prisma.student.update({
      where: {
        id: session?.user.id,
      },
      data: {
        address,
        category,
        course,
        college
      },
    });
    if (parent.name || parent.phone) {
      await prisma.parent.create({
        data: {
          ...parent,
          studentId: session?.user.id,
        },
      });
    }

    const updatedStudent = await prisma.student.findUnique({
      where: { id: session?.user.id },
      include: { parent: true },
    });

    if (
      updatedStudent &&
      updatedStudent.address &&
      updatedStudent.category &&
      updatedStudent.college &&
      updatedStudent.course &&
      updatedStudent.parent &&
      updatedStudent.parent.name &&
      updatedStudent.parent.phone
    ) {
      await prisma.student.update({
        where: { id: session?.user.id },
        data: { profileSetup: true },
      });
    }

    return { error: false, msg: "Profile updated successfully" };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function fetchParentInfo(): Promise<{ name: string; email: string; phone: string }> {
  try {
    const session = await auth();

    if (!session) {
      return { name: "", email: "", phone: "" };
    }

    const parent = await prisma.parent.findFirst({
      where: {
        studentId: session?.user.id,
      },
    });

    if (!parent) {
      return { name: "", email: "", phone: "" };
    }

    return {
      name: parent.name,
      email: parent.email ?? "",
      phone: parent.phone,
    };

  } catch (error) {
    console.error(error);
    return { name: "", email: "", phone: "" };
  }
}

