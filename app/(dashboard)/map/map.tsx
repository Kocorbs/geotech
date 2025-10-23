"use client";

import { getUserLocations } from "@/actions/locations.action";
import { Facility, UserLocation, Zone } from "@prisma/client";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const UserMap = dynamic(() => import("./UserMap"), {
  ssr: false, // disable server-side rendering
});

export function Map({
  zones,
  facilities,
}: {
  zones: Zone[];
  facilities: Facility[];
}) {
  const [locations, setLocations] = useState<UserLocation[]>([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchLocations = async () => {
      const locations = await getUserLocations(session.user.id);
      setLocations(locations);
    };

    fetchLocations();
  }, [status, session?.user?.id]);

  return (
    <UserMap zones={zones} facilities={facilities} locations={locations} />
  );
}
