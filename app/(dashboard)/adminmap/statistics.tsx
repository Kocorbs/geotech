import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facility, Zone } from "@prisma/client";
import {
  Activity,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Droplets,
  Mountain,
  Wind,
  Home,
} from "lucide-react";

interface StatisticsProps {
  facilities: Facility[];
  zones: Zone[];
}

export function Statistics({ facilities, zones }: StatisticsProps) {
  const activeZones = zones.filter((zone) => zone.status === "ACTIVE");
  const resolvedZones = zones.filter((zone) => zone.status === "RESOLVED");

  const facilitiesByType = facilities.reduce((acc, facility) => {
    acc[facility.type] = (acc[facility.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const zonesByDangerLevel = activeZones.reduce((acc, zone) => {
    acc[zone.dangerLevel] = (acc[zone.dangerLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const zonesByDisasterType = activeZones.reduce((acc, zone) => {
    acc[zone.disasterType] = (acc[zone.disasterType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const facilityIcons = {
    HOSPITAL: <Building2 className="h-4 w-4" />,
    CLINIC: <Building2 className="h-4 w-4" />,
    FIRESTATION: <Flame className="h-4 w-4" />,
    POLICE: <AlertTriangle className="h-4 w-4" />,
    EVAC_CENTER: <Home className="h-4 w-4" />,
  };

  const disasterIcons = {
    FLOOD: <Droplets className="h-4 w-4" />,
    FIRE: <Flame className="h-4 w-4" />,
    EARTHQUAKE: <Activity className="h-4 w-4" />,
    LANDSLIDE: <Mountain className="h-4 w-4" />,
    TYPHOON: <Wind className="h-4 w-4" />,
  };

  const dangerLevelColors = {
    LOW: "text-green-600 bg-green-50 border-green-200",
    MEDIUM: "text-yellow-600 bg-yellow-50 border-yellow-200",
    HIGH: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="space-y-6 p-6">
      {/* Main Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Facilities
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilities.length}</div>
            <p className="text-xs text-muted-foreground">
              Emergency response facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Zones</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeZones.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active disaster zones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Zones
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedZones.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved zones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{zones.length}</div>
            <p className="text-xs text-muted-foreground">
              All disaster zones tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Facilities by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Facilities by Type</CardTitle>
            <CardDescription>
              Distribution of emergency facilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(facilitiesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {facilityIcons[type as keyof typeof facilityIcons]}
                  <span className="text-sm font-medium">
                    {type
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
                <span className="text-2xl font-bold">{count}</span>
              </div>
            ))}
            {Object.keys(facilitiesByType).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No facilities recorded
              </p>
            )}
          </CardContent>
        </Card>

        {/* Active Zones by Danger Level */}
        <Card>
          <CardHeader>
            <CardTitle>Danger Levels</CardTitle>
            <CardDescription>
              Active zones by danger classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["HIGH", "MEDIUM", "LOW"].map((level) => (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${dangerLevelColors[
                      level as keyof typeof dangerLevelColors
                    ]
                      .split(" ")[0]
                      .replace("text-", "bg-")}`}
                  />
                  <span className="text-sm font-medium">{level}</span>
                </div>
                <span className="text-2xl font-bold">
                  {zonesByDangerLevel[level] || 0}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Zones by Disaster Type */}
        <Card>
          <CardHeader>
            <CardTitle>Disaster Types</CardTitle>
            <CardDescription>
              Active zones by disaster classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(zonesByDisasterType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {disasterIcons[type as keyof typeof disasterIcons]}
                  <span className="text-sm font-medium">
                    {type
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
                <span className="text-2xl font-bold">{count}</span>
              </div>
            ))}
            {Object.keys(zonesByDisasterType).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No active disasters
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
