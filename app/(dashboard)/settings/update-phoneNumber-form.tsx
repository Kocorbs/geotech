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
import { updateUserPhoneNumber } from "@/actions/user.action";

// ✅ Schema for updating phone number
const schema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be 11 digits")
    .max(13, "Phone number must be 11 digits or in +63 format")
    .regex(/^(639\d{9}|\+639\d{9})$/, "Invalid Philippine phone number"),
});

export type UpdatePhoneNumberFormData = z.infer<typeof schema>;

export function UpdatePhoneNumberForm({
  className,
  defaultValues,
  userId,
  ...props
}: React.ComponentProps<"form"> & {
  defaultValues?: Partial<UpdatePhoneNumberFormData>;
  userId: number;
}) {
  const form = useForm<UpdatePhoneNumberFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phoneNumber: defaultValues?.phoneNumber ?? "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(values: UpdatePhoneNumberFormData) {
    try {
      setLoading(true);
      await updateUserPhoneNumber(userId, values);
      toast.success("Phone number updated successfully!");
      router.refresh(); // ✅ Refresh to reflect changes
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating your phone number");
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
          <h1 className="text-2xl font-bold">Phone Number</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your phone number below
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="09*********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
