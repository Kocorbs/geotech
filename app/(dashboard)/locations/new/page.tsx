"use client";

import { SiteHeader } from "@/components/site-header";
import dynamic from "next/dynamic";

// Dynamically import your LocationForm component
const LocationForm = dynamic(() => import("./LocationForm"), {
  ssr: false, // ✅ disable SSR to avoid Leaflet errors
});

export default function NewLocationPage() {
  return (
    <main>
      <SiteHeader title="New Location" />
      <LocationForm />
    </main>
  );
}
