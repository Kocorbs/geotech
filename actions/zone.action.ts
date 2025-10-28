"use server";

import prisma from "@/lib/prisma";
import { DangerLevel, DisasterType, ZoneStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { sendSms } from "@/lib/philsms";

export async function createZone(data: FormData) {
  try {
    const geoJson = JSON.parse(data.get("geoJson") as string);

    // ✅ Create zone + discussion
    const zone = await prisma.zone.create({
      data: {
        name: data.get("name") as string,
        description: data.get("description") as string,
        status: data.get("status") as ZoneStatus,
        geoJson,
        disasterType: data.get("disasterType") as DisasterType,
        dangerLevel: data.get("dangerLevel") as DangerLevel,
        discussion: {
          create: {
            content: `${data.get("description")}`,
          },
        },
      },
    });

    // ✅ Get all user locations
    const userLocations = await prisma.userLocation.findMany({
      include: { user: true }, // so we can access phone numbers
    });

    const affected: { zoneId: number; userLocationId: number }[] = [];
    const notifiedIds: number[] = [];

    // ✅ Check which users are inside the GeoJSON area
    for (const loc of userLocations) {
      const locPoint = point([loc.longitude, loc.latitude]);

      if (booleanPointInPolygon(locPoint, geoJson)) {
        affected.push({ zoneId: zone.id, userLocationId: loc.id });

        // ✅ Send SMS if phone number available
        if (loc.user.phoneNumber) {
          console.log(`📱 SMS ${loc.user.phoneNumber}`);
          const message = `Update: ${
            loc.name
          } is a ${zone.dangerLevel.toLowerCase()} risk area for ${zone.disasterType.toLowerCase()}. Stay cautious and follow local news.`;

          try {
            await sendSms(loc.user.phoneNumber, message);
            notifiedIds.push(loc.id);
          } catch (err) {
            console.error(`❌ Failed to notify ${loc.user.phoneNumber}:`, err);
          }
        }
      }
    }

    // ✅ Create affected records
    if (affected.length > 0) {
      await prisma.affectedUserLocation.createMany({ data: affected });
    }

    // ✅ Mark notified users as "isNotifiend = true"
    if (notifiedIds.length > 0) {
      await prisma.affectedUserLocation.updateMany({
        where: {
          zoneId: zone.id,
          userLocationId: { in: notifiedIds },
        },
        data: { isNotified: true },
      });
    }

    revalidatePath("/");
    return zone;
  } catch (error) {
    console.error("❌ createZone error:", error);
    throw new Error("Failed to create zone");
  }
}

export async function getZones() {
  try {
    return await prisma.zone.findMany({
      include: { affectedUserLocations: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getActiveZones() {
  try {
    return await prisma.zone.findMany({
      where: { status: "ACTIVE" },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function updateZone(zoneId: number, data: FormData) {
  try {
    const updatedZone = await prisma.zone.update({
      where: { id: zoneId },
      data: {
        name: data.get("name") as string,
        description: data.get("description") as string,
      },
    });
    revalidatePath("/");
    return updatedZone;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update zone");
  }
}

export async function deleteZone(zoneId: number) {
  try {
    await prisma.zone.delete({ where: { id: zoneId } });
    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete zone");
  }
}
export async function changeZoneStatus(zoneId: number, newStatus: string) {
  try {
    const updatedZone = await prisma.zone.update({
      where: { id: zoneId },
      data: { status: newStatus as ZoneStatus },
    });
    revalidatePath("/");
    return updatedZone;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to change zone status");
  }
}
