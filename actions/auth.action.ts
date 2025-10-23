"use server";

import { signIn } from "@/auth";
import { LoginFormData } from "@/components/login-form";
import { RegisterFormData } from "@/components/register-form";
import prisma from "@/lib/prisma";

export async function login(data: LoginFormData) {
  try {
    await signIn("credentials", { redirect: false, ...data });
  } catch (error) {
    throw new Error("Login failed");
  }
}

export async function register(data: RegisterFormData) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
  }
}
