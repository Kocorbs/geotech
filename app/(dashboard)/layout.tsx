import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NotificationsProvider } from "@/providers/NotoficationsProvider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <NotificationsProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>{children}</SidebarInset>
      </NotificationsProvider>
    </SidebarProvider>
  );
}
