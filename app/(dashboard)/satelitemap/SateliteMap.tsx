"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";
import {
  Cloud,
  Droplets,
  Wind,
  Eye,
  AlertTriangle,
  Radar,
  Navigation,
  Target,
  Circle,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";

const PH_CENTER = { lat: 12.8797, lon: 121.774 };

// Philippine regions coordinates for tracking
const PHILIPPINE_REGIONS = {
  luzon: {
    lat: 16.0,
    lon: 121.0,
    name: "Luzon",
    bounds: [
      [13.0, 120.0],
      [18.5, 124.5],
    ],
  },
  visayas: {
    lat: 11.0,
    lon: 123.0,
    name: "Visayas",
    bounds: [
      [9.5, 122.0],
      [12.5, 126.0],
    ],
  },
  mindanao: {
    lat: 8.0,
    lon: 125.0,
    name: "Mindanao",
    bounds: [
      [5.0, 122.0],
      [10.0, 126.5],
    ],
  },
  par: {
    lat: 15.0,
    lon: 125.0,
    name: "PAR",
    bounds: [
      [4.0, 115.0],
      [25.0, 135.0],
    ],
  },
};

interface TyphoonAlert {
  name: string;
  category: string;
  windSpeed: number;
  pressure: number;
  location: { lat: number; lon: number };
  affectedRegions: string[];
  landfallPrediction: {
    region: string;
    estimatedTime: string;
    probability: number;
  }[];
  movement: {
    direction: string;
    speed: number;
  };
  radius: {
    inner: number; // km
    outer: number; // km
  };
}

export default function TyphoonMapWithStats() {
  const mapRef = useRef<L.Map | null>(null);
  const [weatherData, setWeatherData] = useState<{
    clouds: number | null;
    humidity: number | null;
    windSpeed: number | null;
    pressure: number | null;
    temp: number | null;
    visibility: number | null;
  }>({
    clouds: null,
    humidity: null,
    windSpeed: null,
    pressure: null,
    temp: null,
    visibility: null,
  });

  const [typhoonAlert, setTyphoonAlert] = useState<TyphoonAlert | null>(null);
  const [radarEnabled, setRadarEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [tempTyphoonName, setTempTyphoonName] = useState("");

  const typhoonCirclesRef = useRef<L.Circle[]>([]);
  const typhoonMarkersRef = useRef<L.Marker[]>([]);

  const { data: session } = useSession(); // Get session data
  const isAdmin = session?.user?.role === "ADMIN"; // Check if user is admin

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || "demo";

  // Helper to convert km to meters for Leaflet circles
  const kmToMeters = (km: number) => km * 1000;

  // Clear previous typhoon visualizations
  const clearTyphoonVisualizations = () => {
    typhoonCirclesRef.current.forEach((circle) => {
      if (circle && mapRef.current && mapRef.current.hasLayer(circle)) {
        mapRef.current.removeLayer(circle);
      }
    });
    typhoonCirclesRef.current = [];

    typhoonMarkersRef.current.forEach((marker) => {
      if (marker && mapRef.current && mapRef.current.hasLayer(marker)) {
        mapRef.current.removeLayer(marker);
      }
    });
    typhoonMarkersRef.current = [];
  };

  // Create typhoon circle layers
  const createTyphoonCircle = (typhoon: TyphoonAlert) => {
    if (!mapRef.current) return;

    clearTyphoonVisualizations();

    // Create concentric circles for typhoon effect
    const createConcentricCircle = (
      radius: number,
      color: string,
      weight: number,
      fillOpacity: number,
      dashArray?: string
    ) => {
      return L.circle([typhoon.location.lat, typhoon.location.lon], {
        radius: kmToMeters(radius),
        color: color,
        weight: weight,
        fillColor: color,
        fillOpacity: fillOpacity,
        dashArray: dashArray,
        className: "typhoon-area",
      });
    };

    // Outer warning area (300km radius)
    const outerCircle = createConcentricCircle(
      300,
      "#dc2626",
      1,
      0.05,
      "10, 10"
    );
    outerCircle.addTo(mapRef.current).bindPopup(`
        <div class="typhoon-popup">
          <strong>Warning Zone (300km)</strong><br>
          Tropical storm force winds possible
        </div>
      `);
    typhoonCirclesRef.current.push(outerCircle);

    // Middle alert area (200km radius)
    const middleCircle = createConcentricCircle(200, "#ef4444", 2, 0.08);
    middleCircle.addTo(mapRef.current).bindPopup(`
        <div class="typhoon-popup">
          <strong>Alert Zone (200km)</strong><br>
          Strong winds and heavy rain likely
        </div>
      `);
    typhoonCirclesRef.current.push(middleCircle);

    // Inner danger area (100km radius)
    const innerCircle = createConcentricCircle(100, "#f87171", 3, 0.12);
    innerCircle.addTo(mapRef.current).bindPopup(`
        <div class="typhoon-popup">
          <strong>Danger Zone (100km)</strong><br>
          Typhoon force winds expected
        </div>
      `);
    typhoonCirclesRef.current.push(innerCircle);

    // Eye wall (50km radius)
    const eyeWall = L.circle([typhoon.location.lat, typhoon.location.lon], {
      radius: kmToMeters(50),
      color: "#ffffff",
      weight: 2,
      fillColor: "#ef4444",
      fillOpacity: 0.2,
      className: "typhoon-eye-wall",
    });
    eyeWall.addTo(mapRef.current);
    typhoonCirclesRef.current.push(eyeWall);

    // Add typhoon marker with animation
    const typhoonIcon = L.divIcon({
      html: `
        <div class="typhoon-marker">
          <div class="typhoon-eye">
            <div class="eye-inner"></div>
          </div>
          <div class="typhoon-spiral">
            <div class="spiral-arm"></div>
            <div class="spiral-arm"></div>
            <div class="spiral-arm"></div>
            <div class="spiral-arm"></div>
          </div>
          <div class="typhoon-label">${typhoon.name}</div>
          <div class="typhoon-category">${typhoon.category}</div>
        </div>
      `,
      className: "typhoon-marker-icon",
      iconSize: [80, 80],
      iconAnchor: [40, 40],
    });

    const marker = L.marker([typhoon.location.lat, typhoon.location.lon], {
      icon: typhoonIcon,
      zIndexOffset: 1000,
    }).addTo(mapRef.current).bindPopup(`
      <div class="typhoon-details-popup">
        <h3 class="font-bold text-lg mb-2">${typhoon.name}</h3>
        <div class="space-y-1">
          <p><strong>Category:</strong> ${typhoon.category}</p>
          <p><strong>Wind Speed:</strong> ${typhoon.windSpeed} km/h</p>
          <p><strong>Pressure:</strong> ${typhoon.pressure} hPa</p>
          <p><strong>Location:</strong> ${typhoon.location.lat.toFixed(
            2
          )}°N, ${typhoon.location.lon.toFixed(2)}°E</p>
          <p><strong>Movement:</strong> ${typhoon.movement.direction} at ${
      typhoon.movement.speed
    } km/h</p>
          <p><strong>Affected Areas:</strong> ${typhoon.affectedRegions.join(
            ", "
          )}</p>
        </div>
      </div>
    `);

    typhoonMarkersRef.current.push(marker);

    // Add wind direction indicator
    const directionIcon = L.divIcon({
      html: `
        <div class="wind-direction" style="transform: rotate(${getWindDirectionAngle(
          typhoon.movement.direction
        )}deg)">
          <div class="direction-arrow"></div>
        </div>
      `,
      className: "wind-direction-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    L.marker([typhoon.location.lat, typhoon.location.lon], {
      icon: directionIcon,
      zIndexOffset: 999,
    }).addTo(mapRef.current);
  };

  // Helper to convert wind direction to angle
  const getWindDirectionAngle = (direction: string) => {
    const directions: Record<string, number> = {
      N: 0,
      NNE: 22.5,
      NE: 45,
      ENE: 67.5,
      E: 90,
      ESE: 112.5,
      SE: 135,
      SSE: 157.5,
      S: 180,
      SSW: 202.5,
      SW: 225,
      WSW: 247.5,
      W: 270,
      WNW: 292.5,
      NW: 315,
      NNW: 337.5,
    };
    return directions[direction.toUpperCase()] || 0;
  };

  // Simulate typhoon data
  const fetchTyphoonData = async () => {
    try {
      // Mock typhoon data with circular areas
      const mockTyphoonData: TyphoonAlert = {
        name: typhoonAlert?.name || "TYPHOON KOCORBS", // Use existing name if editing
        category: "Category 3 Typhoon",
        windSpeed: 185,
        pressure: 920,
        location: { lat: 15.2, lon: 123.8 }, // East of Luzon
        affectedRegions: ["Luzon", "Visayas", " Mindanao"],
        landfallPrediction: [
          {
            region: "Aurora-Isabela Area, Luzon",
            estimatedTime: "2024-12-28 16:00",
            probability: 85,
          },
          {
            region: "Bicol Region, Luzon",
            estimatedTime: "2024-12-28 20:00",
            probability: 75,
          },
          {
            region: "Eastern Visayas",
            estimatedTime: "2024-12-29 06:00",
            probability: 60,
          },
        ],
        movement: {
          direction: "WNW",
          speed: 20,
        },
        radius: {
          inner: 50,
          outer: 300,
        },
      };

      setTyphoonAlert(mockTyphoonData);

      // Create typhoon circles
      createTyphoonCircle(mockTyphoonData);
    } catch (error) {
      console.error("Typhoon data fetch error:", error);
    }
  };

  // Handle typhoon name edit
  const handleStartEditName = () => {
    if (!isAdmin) return; // Only allow admins to edit
    if (typhoonAlert) {
      setTempTyphoonName(typhoonAlert.name);
      setEditingName(true);
    }
  };

  const handleSaveName = () => {
    if (!isAdmin) return; // Only allow admins to save
    if (typhoonAlert && tempTyphoonName.trim()) {
      const updatedTyphoon = {
        ...typhoonAlert,
        name: tempTyphoonName.trim().toUpperCase(),
      };
      setTyphoonAlert(updatedTyphoon);
      setEditingName(false);

      // Update the visualization with new name
      createTyphoonCircle(updatedTyphoon);
    }
  };

  const handleCancelEditName = () => {
    setEditingName(false);
    setTempTyphoonName("");
  };

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("typhoon-map", {
        center: [PH_CENTER.lat, PH_CENTER.lon],
        zoom: 5.5,
        minZoom: 4,
        maxZoom: 12,
      });

      L.control.fullscreen().addTo(map);

      // Base map
      L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Satellite layer
      L.tileLayer(
        `https://tile.openweathermap.org/map/sat_new/{z}/{x}/{y}.png?appid=${apiKey}`,
        { opacity: 0.8, attribution: "© OpenWeatherMap" }
      ).addTo(map);

      // Clouds overlay
      L.tileLayer(
        `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
        { opacity: 0.6, attribution: "© OpenWeatherMap" }
      ).addTo(map);

      // Precipitation radar layer
      const radarLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
        {
          opacity: 0.7,
          attribution: "© OpenWeatherMap Radar",
          pane: "overlayPane",
        }
      );

      if (radarEnabled) {
        radarLayer.addTo(map);
      }

      // Add region boundaries (just outlines)
      Object.entries(PHILIPPINE_REGIONS).forEach(([key, region]) => {
        if (key !== "par") {
          const bounds = region.bounds as L.LatLngBoundsExpression;
          L.rectangle(bounds, {
            color: "#3b82f6",
            weight: 1,
            fillColor: "transparent",
            fillOpacity: 0,
            dashArray: "5, 5",
            className: "region-boundary",
          })
            .addTo(map)
            .bindPopup(`<strong>${region.name}</strong>`)
            .on("click", () => setSelectedRegion(region.name));
        }
      });

      // Add PAR boundary
      const parBounds = PHILIPPINE_REGIONS.par
        .bounds as L.LatLngBoundsExpression;
      L.rectangle(parBounds, {
        color: "#dc2626",
        weight: 2,
        fillColor: "transparent",
        fillOpacity: 0,
        dashArray: "10, 5",
        className: "par-boundary",
      })
        .addTo(map)
        .bindPopup("<strong>Philippine Area of Responsibility (PAR)</strong>");

      mapRef.current = map;
    }

    // Fetch weather data
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${PH_CENTER.lat}&lon=${PH_CENTER.lon}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherData({
          clouds: data.clouds?.all,
          humidity: data.main?.humidity,
          windSpeed: data.wind?.speed,
          pressure: data.main?.pressure,
          temp: data.main?.temp,
          visibility: data.visibility ? data.visibility / 1000 : null,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Weather data fetch error:", err);
        setLoading(false);
      });

    // Fetch typhoon data
    fetchTyphoonData();

    // Refresh data every 10 minutes
    const interval = setInterval(() => {
      fetchTyphoonData();
    }, 600000);

    return () => {
      clearInterval(interval);
      clearTyphoonVisualizations();
    };
  }, [apiKey, radarEnabled]);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit,
    color,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number | null;
    unit: string;
    color: string;
  }) => (
    <div className="bg-card border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">
            {loading ? (
              <span className="text-muted-foreground">--</span>
            ) : (
              <>
                {value ?? "--"}
                {value && <span className="text-sm ml-1">{unit}</span>}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );

  const getAlertStyle = () => {
    if (!typhoonAlert) {
      return "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400";
    }
    return "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className={`border rounded-lg p-4 ${getAlertStyle()}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">Typhoon Alert Status</p>
              <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-700">
                {typhoonAlert ? "ACTIVE TYPHOON" : "CLEAR"}
              </span>
            </div>
            {typhoonAlert ? (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAdmin && editingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempTyphoonName}
                          onChange={(e) => setTempTyphoonName(e.target.value)}
                          className="px-2 py-1 border rounded text-sm font-bold uppercase"
                          placeholder="Enter typhoon name"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveName();
                            if (e.key === "Escape") handleCancelEditName();
                          }}
                        />
                        <button
                          onClick={handleSaveName}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Save name"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEditName}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-medium flex items-center gap-2">
                        <span>{typhoonAlert.name}</span>
                        {isAdmin && (
                          <button
                            onClick={handleStartEditName}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit typhoon name"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                      </p>
                    )}
                    <span>- {typhoonAlert.category}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <p>
                    <strong>Wind:</strong> {typhoonAlert.windSpeed} km/h
                  </p>
                  <p>
                    <strong>Pressure:</strong> {typhoonAlert.pressure} hPa
                  </p>
                  <p>
                    <strong>Movement:</strong> {typhoonAlert.movement.direction}{" "}
                    @ {typhoonAlert.movement.speed} km/h
                  </p>
                  <p>
                    <strong>Radius:</strong> {typhoonAlert.radius.inner}-
                    {typhoonAlert.radius.outer} km
                  </p>
                </div>

                {/* Landfall Predictions */}
                <div className="mt-3 pt-3 border-t border-red-500/20">
                  <p className="font-medium text-sm mb-2">
                    Landfall Predictions:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {typhoonAlert.landfallPrediction.map((pred, idx) => (
                      <div
                        key={idx}
                        className="bg-red-500/5 p-2 rounded text-sm"
                      >
                        <p className="font-semibold">{pred.region}</p>
                        <p className="text-xs">⏱️ {pred.estimatedTime}</p>
                        <p className="text-xs">
                          🎯 {pred.probability}% probability
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm mt-1">
                No active typhoon detected in Philippine Area of Responsibility.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold">Philippines Typhoon Tracker</h2>
          </div>
          <div className="flex gap-2">
            {typhoonAlert && !editingName && isAdmin && (
              <button
                onClick={handleStartEditName}
                className="px-3 py-2 text-sm rounded-md bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Typhoon Name
              </button>
            )}
            <button
              onClick={() => setRadarEnabled(!radarEnabled)}
              className={`px-3 py-2 text-sm rounded-md flex items-center gap-2 ${
                radarEnabled
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <Radar className="w-4 h-4" />
              {radarEnabled ? "Radar: ON" : "Radar: OFF"}
            </button>
            <button
              onClick={() => {
                if (mapRef.current && typhoonAlert) {
                  mapRef.current.setView(
                    [typhoonAlert.location.lat, typhoonAlert.location.lon],
                    6
                  );
                } else {
                  if (mapRef.current) {
                    mapRef.current.setView([PH_CENTER.lat, PH_CENTER.lon], 5.5);
                  }
                }
              }}
              className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              {typhoonAlert ? "Center on Typhoon" : "Reset View"}
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div id="typhoon-map" className="w-full h-[70vh]" />
      </div>

      {/* Legend */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Circle className="w-4 h-4" />
          Typhoon Area Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse"></div>
            <span className="text-sm">Typhoon Eye</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-f87171"></div>
            <span className="text-sm">Danger Zone (100km)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-ef4444"></div>
            <span className="text-sm">Alert Zone (200km)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-dc2626 border-dashed"></div>
            <span className="text-sm">Warning Zone (300km)</span>
          </div>
        </div>
      </div>

      {/* Typhoon Information */}
      {typhoonAlert && (
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Typhoon Impact Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {typhoonAlert.affectedRegions.map((region, idx) => (
              <div
                key={idx}
                className="p-3 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{region}</h4>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-700">
                    AFFECTED
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>Within typhoon radius</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    <span>
                      Expected wind: {typhoonAlert.windSpeed * 0.7} km/h
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Cloud}
          label="Cloud Coverage"
          value={weatherData.clouds}
          unit="%"
          color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={Wind}
          label="Wind Speed"
          value={weatherData.windSpeed}
          unit="m/s"
          color="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
        />
        <StatCard
          icon={Droplets}
          label="Humidity"
          value={weatherData.humidity}
          unit="%"
          color="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          icon={Eye}
          label="Visibility"
          value={weatherData.visibility}
          unit="km"
          color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={Navigation}
          label="Air Pressure"
          value={weatherData.pressure}
          unit="hPa"
          color="bg-orange-500/10 text-orange-600 dark:text-orange-400"
        />
        <StatCard
          icon={Cloud}
          label="Temperature"
          value={weatherData.temp}
          unit="°C"
          color="bg-rose-500/10 text-rose-600 dark:text-rose-400"
        />
      </div>

      {/* Info Footer */}
      <div className="bg-muted/50 border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Data Sources:</strong> OpenWeatherMap API • PAGASA Typhoon
          Tracking • JTWC Tropical Cyclone Data
        </p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleString("en-PH", {
              timeZone: "Asia/Manila",
              hour12: false,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            PHT
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-600">⚠️</span> Red circles indicate
            typhoon affected areas
          </p>
        </div>
      </div>
    </div>
  );
}
