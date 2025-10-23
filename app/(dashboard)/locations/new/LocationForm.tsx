"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Save, Edit3, Map, Info } from "lucide-react";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { createLocation, updateLocation } from "@/actions/locations.action";
import { UserLocation } from "@prisma/client";

export default function LocationForm({ data }: { data?: UserLocation }) {
  const [isClient, setIsClient] = useState(false);
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [lat, setLat] = useState<number | null>(data?.latitude || null);
  const [lng, setLng] = useState<number | null>(data?.longitude || null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const { data: session } = useSession();

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (mapRef.current) return;

    const mapContainer = document.getElementById("location-map");
    if (!mapContainer) return;

    const map = L.map(mapContainer, {
      zoomControl: false,
    }).setView([8.21337, 124.242851], 14);
    mapRef.current = map;

    if (data?.latitude && data?.longitude) {
      const existingMarker = L.marker([data.latitude, data.longitude], {
        icon: L.divIcon({
          html: '<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>',
          className: "custom-marker",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      }).addTo(map);

      markerRef.current = existingMarker;
      map.setView([data.latitude, data.longitude], 16);
    }

    // Add zoom control to top right
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(map);

    // Use a more modern tile layer
    // Use OpenStreetMap for detailed street view
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new (L as any).Control.Draw({
      position: "topright",
      draw: {
        polygon: false,
        rectangle: false,
        circle: false,
        marker: {
          icon: L.divIcon({
            html: '<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>',
            className: "custom-marker",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        },
        polyline: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });
    map.addControl(drawControl);

    map.on((L as any).Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;

      if (layer instanceof L.Marker) {
        const coords = layer.getLatLng();
        setLat(coords.lat);
        setLng(coords.lng);

        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        markerRef.current = layer;
      }
      drawnItems.addLayer(layer);
      toast.success("Location marked on map!");
    });

    map.on((L as any).Draw.Event.DELETED, () => {
      setLat(null);
      setLng(null);
      markerRef.current = null;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isClient, data?.latitude, data?.longitude]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);

        if (mapRef.current) {
          mapRef.current.setView(
            [pos.coords.latitude, pos.coords.longitude],
            16
          );

          if (markerRef.current) {
            mapRef.current.removeLayer(markerRef.current);
          }

          markerRef.current = L.marker(
            [pos.coords.latitude, pos.coords.longitude],
            {
              icon: L.divIcon({
                html: '<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>',
                className: "custom-marker",
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              }),
            }
          ).addTo(mapRef.current);
        }

        setIsLoadingLocation(false);
        toast.success("Current location found!");
      },
      (err) => {
        console.error("Geolocation error:", err);
        setIsLoadingLocation(false);
        const errorMessages = {
          1: "Location access denied. Please enable location permissions.",
          2: "Location unavailable. Please try again.",
          3: "Location request timed out. Please try again.",
        };
        toast.error(
          errorMessages[err.code as keyof typeof errorMessages] ||
            "Failed to get location"
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please provide a location name");
      return;
    }

    if (!lat || !lng) {
      toast.error("Please mark a location on the map");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("latitude", lat.toString());
      formData.append("longitude", lng.toString());
      formData.append("userId", session?.user?.id.toString() || "");

      if (data?.id) {
        // Editing mode
        await updateLocation(data.id.toString(), formData);
        toast.success("Location updated successfully!");
      } else {
        // Creating mode
        await createLocation(formData);
        toast.success("Location saved successfully!");
      }

      // Reset only if creating new
      if (!data?.id) {
        setName("");
        setDescription("");
        setLat(null);
        setLng(null);
        if (markerRef.current && mapRef.current) {
          mapRef.current.removeLayer(markerRef.current);
          markerRef.current = null;
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save location. Please try again.");
    }
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 shadow-lg">
            <Map className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {data ? "Edit Location" : "Add New Location"}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create a new location by filling in the details below and marking it
            on the interactive map
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-background rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-foreground">
                  Location Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Location Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Home Office, Downtown Branch, Sector 7"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Additional notes or details about this location"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-background rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-foreground">
                  Quick Location
                </h2>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleUseCurrentLocation}
                disabled={isLoadingLocation}
                className="w-full h-12 text-blue-600 border-blue-200 hover:bg-blue-50 transition-all duration-200"
              >
                <MapPin
                  className={`mr-2 h-5 w-5 ${
                    isLoadingLocation ? "animate-pulse" : ""
                  }`}
                />
                {isLoadingLocation
                  ? "Getting Location..."
                  : "Use My Current Location"}
              </Button>
            </div>

            {/* Coordinates Display */}
            {lat && lng && (
              <div className="bg-background rounded-xl border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Selected Coordinates
                  </span>
                </div>
                <p className="text-sm text-blue-700 font-mono">
                  {formatCoordinates(lat, lng)}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!name.trim() || !lat || !lng}
              >
                <Save className="mr-2 h-5 w-5" />
                {data ? "Update Location" : "Save Location"}
              </Button>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-4">
            <div className="bg-background rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-foreground">
                  Interactive Map
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Click the marker tool in the top-right corner to pin your
                location, or use the polygon/rectangle tools to define an area.
              </p>

              {isClient && (
                <div className="relative">
                  <div
                    id="location-map"
                    className="h-96 w-full border-2 border-gray-200 rounded-lg overflow-hidden shadow-inner"
                  />
                  {!lat && !lng && (
                    <div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center pointer-events-none">
                      <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                        <p className="text-sm text-gray-600">
                          Click the map tools to mark your location
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
