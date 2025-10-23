import { auth } from "@/auth";
import WeatherDashboard from "./Weather";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) return;

  return <WeatherDashboard userId={session.user.id} />;
}
