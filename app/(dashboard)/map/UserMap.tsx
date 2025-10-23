"use client";

import { UserLocation, Facility, Zone } from "@prisma/client";
import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";
import { getDisasterIconHTML, getFacilityIconHTML } from "@/lib/icons";

declare module "leaflet" {
  namespace control {
    function fullscreen(options?: any): L.Control;
  }
}

export default function UserMap({
  locations,
  facilities,
  zones,
}: {
  locations: UserLocation[];
  facilities: Facility[];
  zones: Zone[];
}) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const tubodBounds: L.LatLngBoundsExpression = [
        [8.142, 124.026],
        [8.292, 124.306],
      ];

      const map = L.map("user-map", {
        center: [8.21337, 124.242851],
        zoom: 14,
        maxBounds: tubodBounds,
        maxBoundsViscosity: 1.0,
        minZoom: 13,
        maxZoom: 18,
      });
      L.control.fullscreen().addTo(map);
      mapRef.current = map;

      // Basemap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
    }

    const map = mapRef.current!;
    const markers: L.Marker[] = [];

    // ✅ Default icon
    const DefaultIcon = L.icon({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // ✅ User locations
    locations.forEach((loc) => {
      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: DefaultIcon,
      }).addTo(map);
      marker.bindPopup(`
        <strong>${loc.name}</strong><br/>
        ${loc.description ?? ""}
      `);
      markers.push(marker);
    });

    // Render existing facilities
    facilities.forEach((f) => {
      L.marker([f.latitude, f.longitude], {
        icon: L.divIcon({
          html: getFacilityIconHTML(f.type),
          className: "custom-marker", // optional wrapper class
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      })
        .addTo(map)
        .bindPopup(`<strong>${f.name}</strong><br/>${f.type}`);
    });

    zones.forEach((z) => {
      const color =
        z.dangerLevel === "HIGH"
          ? "red"
          : z.dangerLevel === "MEDIUM"
          ? "orange"
          : "green";

      // Create GeoJSON layer for the zone
      const layer = L.geoJSON(z.geoJson as any, {
        style: {
          color,
          weight: 2,
          fillOpacity: 0.4,
        },
      }).addTo(map);

      // Build the popup HTML
      const popupHTML = `
    <div class="p-1 text-sm">
      <div class="flex items-center gap-2">
        ${getDisasterIconHTML(z.disasterType)}
        <strong>${z.name}</strong>
      </div>
      <div class="mt-1">
        <span class="font-semibold">Disaster:</span> ${z.disasterType}<br/>
        <span class="font-semibold">Danger:</span>
        <span class="${
          z.dangerLevel === "HIGH"
            ? "text-red-600"
            : z.dangerLevel === "MEDIUM"
            ? "text-orange-500"
            : "text-green-600"
        }">
          ${z.dangerLevel}
        </span>
      </div>
    </div>
  `;

      // Bind popup to the zone
      layer.bindPopup(popupHTML);

      // 🔸 Hover behavior for the zone
      layer.on("mouseover", function (e) {
        const layerTarget = e.target;
        layerTarget.openPopup(e.latlng);
        layerTarget.setStyle({
          weight: 3,
          fillOpacity: 0.6,
        });
      });

      layer.on("mouseout", function (e) {
        const layerTarget = e.target;
        layerTarget.closePopup();
        layerTarget.setStyle({
          weight: 2,
          fillOpacity: 0.4,
        });
      });

      // ✅ Add icon marker at the zone's center
      const center = layer.getBounds().getCenter();

      const iconMarker = L.marker(center, {
        icon: L.divIcon({
          html: getDisasterIconHTML(z.disasterType),
          className: "zone-icon-marker",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      }).addTo(map);

      // 🧩 Same popup on hover for the icon
      iconMarker.bindPopup(popupHTML);

      iconMarker.on("mouseover", function () {
        iconMarker.openPopup();
      });

      iconMarker.on("mouseout", function () {
        iconMarker.closePopup();
      });
    });

    // ✅ Fit map bounds to all features
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }

    // ✅ Ensure map resizes correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [locations, facilities, zones]);

  return (
    <div
      id="user-map"
      className="w-full h-[90vh]" // or h-screen if you want fullscreen
    />
  );
}
