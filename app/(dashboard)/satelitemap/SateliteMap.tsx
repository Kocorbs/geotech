"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";
import {
  Cloud,
  Wind,
  Droplets,
  Eye,
  AlertTriangle,
  MapPin,
} from "lucide-react";

const PH_CENTER = { lat: 12.8797, lon: 121.774 };

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
  const [typhoonAlert, setTyphoonAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || "demo";

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("typhoon-map", {
        center: [PH_CENTER.lat, PH_CENTER.lon],
        zoom: 5,
        minZoom: 5,
        maxZoom: 10,
      });

      L.control.fullscreen().addTo(map);

      // Base map
      L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Satellite layer
      L.tileLayer(
        `https://tile.openweathermap.org/map/sat_new/{z}/{x}/{y}.png?appid=${apiKey}`,
        { opacity: 0.7 }
      ).addTo(map);

      // Clouds overlay
      L.tileLayer(
        `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
        { opacity: 0.5 }
      ).addTo(map);

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
          visibility: data.visibility ? data.visibility / 1000 : null, // convert to km
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Weather data fetch error:", err);
        setLoading(false);
      });

    // Fetch alerts
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${PH_CENTER.lat}&lon=${PH_CENTER.lon}&exclude=minutely,hourly,daily&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.alerts && data.alerts.length > 0) {
          setTyphoonAlert(data.alerts[0].event);
        } else {
          setTyphoonAlert("No active weather alerts");
        }
      })
      .catch((err) => {
        console.error("Alert fetch error:", err);
        setTyphoonAlert("Alert information unavailable");
      });
  }, [apiKey]);

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
    if (!typhoonAlert || typhoonAlert.includes("No active")) {
      return "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400";
    }
    return "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className={`border rounded-lg p-4 ${getAlertStyle()}`}>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Weather Alert Status</p>
            <p className="text-sm mt-1">
              {loading ? "Checking for alerts..." : typhoonAlert}
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="bg-card border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold">Philippines Weather Map</h2>
          </div>
        </div>
        <div id="typhoon-map" className="w-full h-[60vh]" />
      </div>

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
          icon={Wind}
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
          <strong>Data Source:</strong> OpenWeatherMap API • Real-time weather
          monitoring for the Philippines region
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated:{" "}
          {new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })} PHT
        </p>
      </div>
    </div>
  );
}
