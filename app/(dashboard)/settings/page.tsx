import { SiteHeader } from "@/components/site-header";
import UserSettings from "./user-settings";

export default function SettingsPage() {
  return (
    <main>
      <SiteHeader title="Settings" />
      <UserSettings />
    </main>
  );
}
