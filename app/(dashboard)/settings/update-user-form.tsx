"use client";

import { cn } from "@/lib/utils";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateUser } from "@/actions/user.action";

// ✅ Schema for updating user (no password fields)
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
});

export type UpdateUserFormData = z.infer<typeof schema>;

export function UpdateUserForm({
  className,
  defaultValues,
  userId,
  ...props
}: React.ComponentProps<"form"> & {
  defaultValues?: Partial<UpdateUserFormData>;
  userId: number;
}) {
  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      email: defaultValues?.email ?? "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(values: UpdateUserFormData) {
    try {
      setLoading(true);
      await updateUser(userId, values);
      toast.success("Profile updated successfully!");
      router.refresh(); // ✅ Refresh the page to show updated data
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating your profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Update Profile</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Edit your personal details below
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
