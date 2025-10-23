import { SiteHeader } from "@/components/site-header";
import { Map } from "./map";
import { getFacilities } from "@/actions/facility.action";
import { getActiveZones } from "@/actions/zone.action";

export default async function MapPage() {
  const facilities = await getFacilities();
  const zones = await getActiveZones();

  return (
    <main>
      <SiteHeader title="Map" />
      <Map facilities={facilities || []} zones={zones || []} />
    </main>
  );
}
