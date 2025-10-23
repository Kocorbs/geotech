"use client";

import { UserLocation } from "@prisma/client";
import dynamic from "next/dynamic";

// Dynamically import your LocationForm component
const LocationForm = dynamic(() => import("../new/LocationForm"), {
  ssr: false, // ✅ disable SSR to avoid Leaflet errors
});

export function Location({ location }: { location: UserLocation }) {
  return <LocationForm data={location} />;
}
