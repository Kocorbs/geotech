"use server";

import { PasswordFormData } from "@/app/(dashboard)/settings/update-password-form";
import { UpdatePhoneNumberFormData } from "@/app/(dashboard)/settings/update-phoneNumber-form";
import { UpdateUserFormData } from "@/app/(dashboard)/settings/update-user-form";
import prisma from "@/lib/prisma";

export async function getUser(userId: number) {
  try {
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(userId: number, data: UpdateUserFormData) {
  try {
    await prisma.user.update({ where: { id: userId }, data });
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserPassword(
  userId: number,
  data: PasswordFormData
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return new Error("Lol");

    if (data.currentPassword != user?.password)
      throw new Error("Current password is incorrect");

    await prisma.user.update({
      where: { id: userId },
      data: { password: data.newPassword },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserPhoneNumber(
  userId: number,
  data: UpdatePhoneNumberFormData
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { phoneNumber: data.phoneNumber },
    });
  } catch (error) {
    console.log(error);
  }
}
