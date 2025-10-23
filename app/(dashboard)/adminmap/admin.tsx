"use client";

import { Facility, Zone, ZoneStatus } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminMap = dynamic(() => import("./AdminMap"), {
  ssr: false, // disable server-side rendering
});

export default function Admin({
  facilities,
  zones,
}: {
  facilities: Facility[];
  zones: Zone[];
}) {
  const [filter, setFilter] = useState<ZoneStatus | "ALL">("ACTIVE");

  const filteredZones = zones.filter((zone) => {
    if (filter === "ALL") return true;
    return zone.status === filter;
  });

  return (
    <div className="space-y-4 ">
      {/* 🔘 Filter Toggle */}
      <div className="flex items-center justify-end gap-2 p-2">
        <label className="text-sm font-medium">Show:</label>
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as ZoneStatus | "ALL")}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter zones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 🗺️ Map */}
      <AdminMap facilities={facilities} zones={filteredZones} />
    </div>
  );
}
