"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CloudRain, Clock } from "lucide-react";
import { useNotifications } from "@/providers/NotoficationsProvider";
import { getForecastByCoords } from "@/lib/weather";

interface RainAlert {
  time: string;
  chance: number;
  description: string;
}

export function RainWarnings() {
  const [rainAlerts, setRainAlerts] = useState<RainAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Fetch Iligan City by default (you can later connect user location)
    const fetchRainForecast = async () => {
      try {
        const forecast = await getForecastByCoords(8.1713, 124.2152); // Iligan City
        const alerts: RainAlert[] = [];

        forecast.list.forEach((item: any) => {
          if (item.pop && item.pop > 0.5) {
            const time = new Date(item.dt * 1000).toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            });
            const chance = Math.round(item.pop * 100);

            alerts.push({
              time,
              chance,
              description: item.weather[0].description,
            });

            // Also push a system notification
            addNotification({
              id: `rain-${item.dt}`,
              title: "🌧️ High Chance of Rain",
              message: `There's a ${chance}% chance of rain around ${time} (${item.weather[0].description}).`,
              type: "info",
              timestamp: new Date(),
            });
          }
        });

        setRainAlerts(alerts);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch rain warnings");
      } finally {
        setLoading(false);
      }
    };

    fetchRainForecast();
  }, []);

  if (loading) {
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-primary" />
            Rain Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Checking forecasts...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="my-4 border-red-300 bg-red-50 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Rain Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (rainAlerts.length === 0) {
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-primary" />
            Rain Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No significant rain expected in the next 24 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-4 border-blue-300 bg-blue-50 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-blue-700">
          <CloudRain className="w-5 h-5" />
          Rain Warnings ({rainAlerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rainAlerts.map((alert, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-sm border-b pb-2 last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{alert.time}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-blue-700">
                {alert.chance}%
              </span>{" "}
              <span className="text-muted-foreground">{alert.description}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
