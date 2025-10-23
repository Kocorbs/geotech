"use server";

import prisma from "@/lib/prisma";

export async function getLocationHistory(locationId: number) {
  try {
    return await prisma.affectedUserLocation.findMany({
      where: { userLocationId: locationId },
      include: { zone: true },
    });
  } catch (error) {
    console.log(error);
  }
}
