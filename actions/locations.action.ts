"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

export async function createLocation(data: FormData) {
  try {
    // Create new user location
    const location = await prisma.userLocation.create({
      data: {
        name: data.get("name") as string,
        description: data.get("description") as string,
        latitude: parseFloat(data.get("latitude") as string),
        longitude: parseFloat(data.get("longitude") as string),
        userId: parseInt(data.get("userId") as string, 10),
      },
    });

    // ✅ Find all ACTIVE zones
    const activeZones = await prisma.zone.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, geoJson: true },
    });

    const locPoint = point([location.longitude, location.latitude]);
    const affectedZones: { zoneId: number; userLocationId: number }[] = [];

    // ✅ Check if the location falls inside any active zone
    activeZones.forEach((zone) => {
      if (booleanPointInPolygon(locPoint, zone.geoJson as any)) {
        affectedZones.push({
          zoneId: zone.id,
          userLocationId: location.id,
        });
      }
    });

    // ✅ If affected, record the associations
    if (affectedZones.length > 0) {
      await prisma.affectedUserLocation.createMany({
        data: affectedZones,
      });
    }

    return location;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create location");
  }
}

export async function updateLocation(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);

  try {
    // ✅ Update the user location
    const location = await prisma.userLocation.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        latitude,
        longitude,
      },
    });

    // ✅ Delete old affected zone associations (in case location moved)
    await prisma.affectedUserLocation.deleteMany({
      where: { userLocationId: location.id },
    });

    // ✅ Find all ACTIVE zones
    const activeZones = await prisma.zone.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, geoJson: true },
    });

    const locPoint = point([location.longitude, location.latitude]);
    const affectedZones: { zoneId: number; userLocationId: number }[] = [];

    // ✅ Check if updated location falls inside active zones
    activeZones.forEach((zone) => {
      if (booleanPointInPolygon(locPoint, zone.geoJson as any)) {
        affectedZones.push({
          zoneId: zone.id,
          userLocationId: location.id,
        });
      }
    });

    // ✅ If affected, recreate associations
    if (affectedZones.length > 0) {
      await prisma.affectedUserLocation.createMany({
        data: affectedZones,
      });
    }

    return location;
  } catch (error) {
    console.error("Error updating location:", error);
    throw new Error("Failed to update location");
  }
}

export async function getUserLocations(userId: number) {
  try {
    return await prisma.userLocation.findMany({
      where: { userId },
      include: {
        affectedUserLocations: {
          where: {
            zone: {
              status: "ACTIVE",
            },
          },
          include: { zone: true },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error");
  }
}

export async function deleteUserLocation(locationId: number) {
  try {
    await prisma.userLocation.delete({ where: { id: locationId } });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}

export async function getUserLocation(locationId: number) {
  try {
    return await prisma.userLocation.findUnique({ where: { id: locationId } });
  } catch (error) {
    console.log(error);
    throw new Error("Error");
  }
}
