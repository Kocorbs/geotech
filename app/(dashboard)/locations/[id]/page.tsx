import { getUserLocation } from "@/actions/locations.action";
import React from "react";
import { Location } from "./Location";
import { SiteHeader } from "@/components/site-header";
import { Affected } from "./affected";

export default async function LocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const location = await getUserLocation(parseInt(id));

  if (!location) return;

  return (
    <main>
      <SiteHeader title="Location" />
      <Location location={location} />
      <Affected locationId={location.id} />
    </main>
  );
}
