import { DisasterType, FacilityType } from "@prisma/client";

// --- Helper: Facility Icons ---
export function getFacilityIconHTML(type: FacilityType): string {
  switch (type) {
    case FacilityType.HOSPITAL:
      return `<img src="/leaflet/hospital.svg" class="w-6 h-6 bg-red-500 text-white p-1 rounded-full shadow-md" />`;
    case FacilityType.CLINIC:
      return `<img src="/leaflet/clinic.svg" class="w-6 h-6 bg-green-500 p-1 rounded-full shadow-md" />`;
    case FacilityType.FIRESTATION:
      return `<img src="/leaflet/firestation.svg" class="w-6 h-6 bg-orange-500 p-1 rounded-full shadow-md" />`;
    case FacilityType.POLICE:
      return `<img src="/leaflet/police.svg" class="w-6 h-6 bg-blue-500 p-1 rounded-full shadow-md" />`;
    case FacilityType.EVAC_CENTER:
      return `<img src="/leaflet/evacuation.svg" class="w-6 h-6 bg-yellow-500 p-1 rounded-full shadow-md" />`;
    default:
      return `<img src="/leaflet/default.svg" class="w-6 h-6 bg-gray-400 p-1 rounded-full shadow-md" />`;
  }
}

// --- Helper: Disaster Icons ---
export function getDisasterIconHTML(type: DisasterType): string {
  switch (type) {
    case DisasterType.FLOOD:
      return `<img src="/leaflet/flood.svg" class="w-6 h-6 bg-blue-400 p-1 rounded-full animate-pulse" />`;
    case DisasterType.FIRE:
      return `<img src="/leaflet/fire.svg" class="w-6 h-6 bg-red-600 p-1 rounded-full animate-pulse" />`;
    case DisasterType.EARTHQUAKE:
      return `<img src="/leaflet/earthquake.svg" class="w-6 h-6 bg-gray-600 p-1 rounded-full animate-pulse" />`;
    case DisasterType.LANDSLIDE:
      return `<img src="/leaflet/landslide.svg" class="w-6 h-6 bg-amber-700 p-1 rounded-full animate-pulse" />`;
    case DisasterType.TYPHOON:
      return `<img src="/leaflet/typhoon.svg" class="w-6 h-6 bg-cyan-500 p-1 rounded-full animate-pulse" />`;
    default:
      return `<img src="/leaflet/default.svg" class="w-6 h-6 bg-gray-400 p-1 rounded-full animate-pulse" />`;
  }
}