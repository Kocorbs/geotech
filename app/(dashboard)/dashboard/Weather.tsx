"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { getForecastByCoords } from "@/lib/weather";
import {
  MapPin,
  Navigation,
  Droplets,
  Wind,
  Eye,
  Gauge,
  RefreshCw,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { getUserLocations } from "@/actions/locations.action";
import { AddLocationFAB } from "../locations/new/add-location";
import { FullUserLocation } from "@/lib/types";
import Link from "next/link";
import { useNotifications } from "@/providers/NotoficationsProvider";
import { RainWarnings } from "./RainWarnings";

/** Minimal warning type for props */
type AffectedWarning = {
  zoneId: number;
  zoneName: string;
  zoneDescription?: string | null;
  disasterType: string;
  dangerLevel: string;
  active: boolean;
};

interface WeatherData {
  city: {
    name: string;
    country: string;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    visibility: number;
    dt_txt: string;
  }>;
}

const getWeatherIcon = (weatherMain: string) => {
  switch (weatherMain.toLowerCase()) {
    case "clear":
      return <Sun className="w-6 h-6 text-yellow-500" />;
    case "clouds":
      return <Cloud className="w-6 h-6 text-gray-500" />;
    case "rain":
    case "drizzle":
      return <CloudRain className="w-6 h-6 text-blue-500" />;
    case "snow":
      return <Snowflake className="w-6 h-6 text-blue-200" />;
    default:
      return <Cloud className="w-6 h-6 text-gray-500" />;
  }
};

const WeatherCard = ({
  title,
  lat,
  lon,
  useGeolocation = false,
  icon,
  warnings = [],
}: {
  title: string;
  lat?: number;
  lon?: number;
  useGeolocation?: boolean;
  icon: React.ReactNode;
  warnings?: AffectedWarning[]; // new prop - warnings for this location
}) => {
  const [forecast, setForecast] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getForecastByCoords(latitude, longitude);
      setForecast(data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (useGeolocation) {
      getCurrentLocation();
    } else if (lat && lon) {
      fetchForecast(lat, lon);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      setLoading(false);
      // fallback to default Iligan City coordinates
      fetchForecast(8.1713, 124.2152);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchForecast(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log(error);
        setError("Could not get your location. Using default location.");
        // fallback to default Iligan City coordinates
        fetchForecast(8.1713, 124.2152);
      }
    );
  };

  useEffect(() => {
    if (useGeolocation) {
      getCurrentLocation();
    } else if (lat && lon) {
      fetchForecast(lat, lon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, useGeolocation]);

  // Determine active warnings (only those with active === true)
  const activeWarnings = warnings.filter((w) => w.active);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!forecast) return null;

  const currentWeather = forecast.list[0];
  const todayForecasts = forecast.list.slice(1, 5);

  return (
    <Card>
      {/* If there are active warnings, show a red banner at top of card */}
      {activeWarnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800 p-3 rounded-t">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-red-700">
                    {activeWarnings.length === 1
                      ? `Warning: ${activeWarnings[0].zoneName}`
                      : `${activeWarnings.length} active warnings`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {activeWarnings[0]?.zoneDescription ??
                      "Please review the warnings for this area."}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs uppercase text-red-700 font-medium tracking-wide">
                    {activeWarnings[0].dangerLevel}
                  </div>
                  <Button size="sm" variant="destructive">
                    <Link href="/map">View on Map</Link>
                  </Button>
                </div>
              </div>

              {/* If multiple warnings, show a small list */}
              {activeWarnings.length > 1 && (
                <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                  {activeWarnings.map((w) => (
                    <li key={w.zoneId} className="flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3" />
                      <span>
                        {w.zoneName} — {w.dangerLevel}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <CardHeader className={`pb-3 ${activeWarnings.length > 0 ? "pt-4" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>
            {forecast.city.name}, {forecast.city.country}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(currentWeather.weather[0].main)}
            <div>
              <div className="text-3xl font-bold">
                {Math.round(currentWeather.main.temp)}°C
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {currentWeather.weather[0].description}
              </p>
              <p className="text-xs text-muted-foreground">
                Feels like {Math.round(currentWeather.main.feels_like)}°C
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>H: {Math.round(currentWeather.main.temp_max)}°</p>
            <p>L: {Math.round(currentWeather.main.temp_min)}°</p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4" />
            <span className="text-muted-foreground">Humidity</span>
            <span className="ml-auto font-medium">
              {currentWeather.main.humidity}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="w-4 h-4" />
            <span className="text-muted-foreground">Wind</span>
            <span className="ml-auto font-medium">
              {currentWeather.wind.speed} m/s
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4" />
            <span className="text-muted-foreground">Pressure</span>
            <span className="ml-auto font-medium">
              {currentWeather.main.pressure} hPa
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4" />
            <span className="text-muted-foreground">Visibility</span>
            <span className="ml-auto font-medium">
              {(currentWeather.visibility / 1000).toFixed(1)} km
            </span>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">
            Next 12 Hours
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {todayForecasts.map((item, idx) => (
              <div
                key={idx}
                className="text-center p-3 rounded-lg border bg-muted/50"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(item.dt * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  })}
                </p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(item.weather[0].main)}
                </div>
                <p className="text-sm font-medium">
                  {Math.round(item.main.temp)}°C
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.main.humidity}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function WeatherDashboard({ userId }: { userId: number }) {
  const [locations, setLocations] = useState<FullUserLocation[]>([]);
  const { addNotification, clearNotifications } = useNotifications();

  useEffect(() => {
    const fetchUserLocations = async () => {
      clearNotifications(); // clear old ones
      const data = await getUserLocations(userId);
      setLocations(data);

      // check for active zones
      data.forEach((loc) => {
        loc.affectedUserLocations.forEach((aff) => {
          if (aff.zone.status === "ACTIVE") {
            addNotification({
              id: `${aff.zone.id}-${loc.id}`,
              title: `⚠️ ${aff.zone.disasterType} Alert`,
              message: `${
                loc.name
              } is within an active ${aff.zone.disasterType.toLowerCase()} zone (${
                aff.zone.dangerLevel
              })`,
              type: "danger",
              timestamp: new Date(),
            });
          }
        });
      });
    };

    fetchUserLocations();
  }, [userId]);

  // convert affectedUserLocations to AffectedWarning for each location
  const toWarnings = (loc: FullUserLocation): AffectedWarning[] => {
    return (loc.affectedUserLocations ?? []).map((a) => ({
      zoneId: a.zone.id,
      zoneName: a.zone.name,
      zoneDescription: a.zone.description,
      disasterType: a.zone.disasterType,
      dangerLevel: a.zone.dangerLevel,
      active: a.zone.status === "ACTIVE" || a.zone.status === "RESOLVED", // be tolerant
    }));
  };

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader title="Dashboard" />

      <div className="container mx-auto p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <WeatherCard
            title="My Location"
            useGeolocation
            icon={<Navigation className="w-5 h-5 text-primary" />}
            warnings={[]} // geolocation card: no server warnings unless you compute them
          />

          <WeatherCard
            title="Tubod, Iligan City"
            lat={8.1713}
            lon={124.2152}
            icon={<MapPin className="w-5 h-5 text-primary" />}
            warnings={[]}
          />

          {locations.map((loc) => (
            <WeatherCard
              key={loc.id}
              title={loc.name}
              lat={loc.latitude}
              lon={loc.longitude}
              icon={<MapPin className="w-5 h-5 text-primary" />}
              warnings={toWarnings(loc)}
            />
          ))}
        </div>

        <AddLocationFAB />
      </div>
      <section className="p-4">
        <RainWarnings />
      </section>
    </main>
  );
}
