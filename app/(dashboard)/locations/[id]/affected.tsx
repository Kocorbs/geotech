import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Calendar,
  MapPin,
  Activity,
  Flame,
  Droplets,
  Mountain,
  Wind,
  History,
} from "lucide-react";
import { getLocationHistory } from "@/actions/affected.action";

interface AffectedProps {
  locationId: number;
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export async function Affected({ locationId }: AffectedProps) {
  const history = await getLocationHistory(locationId);

  const disasterIcons = {
    FLOOD: <Droplets className="h-4 w-4" />,
    FIRE: <Flame className="h-4 w-4" />,
    EARTHQUAKE: <Activity className="h-4 w-4" />,
    LANDSLIDE: <Mountain className="h-4 w-4" />,
    TYPHOON: <Wind className="h-4 w-4" />,
  };

  const dangerLevelConfig = {
    LOW: {
      badge: "bg-green-100 text-green-800 border-green-200",
      border: "border-l-green-500",
    },
    MEDIUM: {
      badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
      border: "border-l-yellow-500",
    },
    HIGH: {
      badge: "bg-red-100 text-red-800 border-red-200",
      border: "border-l-red-500",
    },
  };

  const statusConfig = {
    ACTIVE: {
      badge: "bg-orange-100 text-orange-800 border-orange-200",
      text: "Active",
    },
    RESOLVED: {
      badge: "bg-gray-100 text-gray-800 border-gray-200",
      text: "Resolved",
    },
  };

  if (!history || history.length === 0) {
    return (
      <Card className="m-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Location History</CardTitle>
          </div>
          <CardDescription>
            Track disaster zones affecting this location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">
              No history found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This location has not been affected by any disaster zones yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeZones = history.filter((entry) => entry.zone.status === "ACTIVE");
  const resolvedZones = history.filter(
    (entry) => entry.zone.status === "RESOLVED"
  );

  return (
    <Card className="m-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Location History</CardTitle>
          </div>
          <div className="flex gap-2">
            {activeZones.length > 0 && (
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                {activeZones.length} Active
              </Badge>
            )}
            <Badge variant="outline" className="text-muted-foreground">
              {history.length} Total
            </Badge>
          </div>
        </div>
        <CardDescription>
          Disaster zones that have affected this location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Active Zones Section */}
          {activeZones.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <h3 className="font-semibold text-sm">Active Threats</h3>
              </div>
              {activeZones.map((entry) => (
                <div
                  key={entry.id}
                  className={`border-l-4 ${
                    dangerLevelConfig[entry.zone.dangerLevel].border
                  } bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-base">
                          {entry.zone.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={statusConfig[entry.zone.status].badge}
                        >
                          {statusConfig[entry.zone.status].text}
                        </Badge>
                      </div>

                      {entry.zone.description && (
                        <p className="text-sm text-muted-foreground">
                          {entry.zone.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 flex-wrap text-sm">
                        <div className="flex items-center gap-1.5">
                          {disasterIcons[entry.zone.disasterType]}
                          <span className="font-medium">
                            {entry.zone.disasterType
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>

                        <Badge
                          variant="outline"
                          className={
                            dangerLevelConfig[entry.zone.dangerLevel].badge
                          }
                        >
                          {entry.zone.dangerLevel} Risk
                        </Badge>

                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Active since {formatDate(entry.zone.dateActive)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Separator between active and resolved */}
          {activeZones.length > 0 && resolvedZones.length > 0 && (
            <Separator className="my-4" />
          )}

          {/* Resolved Zones Section */}
          {resolvedZones.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Past Events
                </h3>
              </div>
              {resolvedZones.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-border bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-base text-muted-foreground">
                          {entry.zone.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={statusConfig[entry.zone.status].badge}
                        >
                          {statusConfig[entry.zone.status].text}
                        </Badge>
                      </div>

                      {entry.zone.description && (
                        <p className="text-sm text-muted-foreground">
                          {entry.zone.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          {disasterIcons[entry.zone.disasterType]}
                          <span>
                            {entry.zone.disasterType
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>

                        <Badge variant="outline" className="text-xs">
                          {entry.zone.dangerLevel} Risk
                        </Badge>

                        {entry.zone.dateResolved && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Resolved {formatDate(entry.zone.dateResolved)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
