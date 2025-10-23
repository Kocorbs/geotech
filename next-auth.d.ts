// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }

  interface Session {
    user: User;
  }
}
