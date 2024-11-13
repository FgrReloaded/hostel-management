"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";


export async function getAllImages() {
  try {
    const images = await prisma.galleryImage.findMany();

    return { error: false, msg: "Images fetched successfully", images };
  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function createNewImage(
  publicUrl: string,
  secureUrl: string
) {
  try {
    const session = await auth();

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const newImage = await prisma.galleryImage.create({
      data: {
        publicUrl,
        secureUrl,
      },
    });

    return { error: false, msg: "Image added successfully", newImage };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}

export async function deleteImage(imageId: bigint) {
  try {
    const session = await auth();

    if (!session || session?.user?.role !== "ADMIN") {
      return { error: true, msg: "Unauthorized" };
    }

    const image = await prisma.galleryImage.delete({
      where: {
        id: imageId,
      },
    });

    return { error: false, msg: "Image deleted successfully", image };

  } catch (error) {
    console.error(error);
    return { error: true, msg: "Something went wrong, please try again!" };
  }
}