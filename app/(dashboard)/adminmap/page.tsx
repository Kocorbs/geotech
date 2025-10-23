import { getFacilities } from "@/actions/facility.action";
import { getZones } from "@/actions/zone.action";
import Admin from "./admin";
import { SiteHeader } from "@/components/site-header";
import { Statistics } from "./statistics";
import ZoneTable from "./zone-table";
import FacilityTable from "./facility-table";

export default async function AdminMapPage() {
  const facilities = await getFacilities();
  const zones = await getZones();

  return (
    <main>
      <SiteHeader title="Admin Map" />
      <Admin facilities={facilities || []} zones={zones || []} />;
      <Statistics facilities={facilities || []} zones={zones || []} />
      <ZoneTable zones={zones || []} />
      <FacilityTable facilities={facilities || []} />
    </main>
  );
}
