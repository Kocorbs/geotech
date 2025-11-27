import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DiscussionWithZone } from "@/lib/types";
import Link from "next/link";
import {
  MapPin,
  MessageSquare,
  Clock,
  AlertTriangle,
  Flame,
  Waves,
  Mountain,
  Wind,
} from "lucide-react";

// Disaster type icons mapping
const getDisasterIcon = (type: string) => {
  switch (type) {
    case "FLOOD":
      return <Waves className="w-5 h-5" />;
    case "FIRE":
      return <Flame className="w-5 h-5" />;
    case "EARTHQUAKE":
      return <Mountain className="w-5 h-5" />;
    case "LANDSLIDE":
      return <Mountain className="w-5 h-5" />;
    case "TYPHOON":
      return <Wind className="w-5 h-5" />;
    default:
      return <AlertTriangle className="w-5 h-5" />;
  }
};

// Danger level colors
const getDangerLevelStyle = (level: string) => {
  switch (level) {
    case "HIGH":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "MEDIUM":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20";
    case "LOW":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getDisasterColor = (type: string) => {
  switch (type) {
    case "FLOOD":
      return "bg-blue-500";
    case "FIRE":
      return "bg-destructive";
    case "EARTHQUAKE":
      return "bg-slate-600";
    case "LANDSLIDE":
      return "bg-amber-600";
    case "TYPHOON":
      return "bg-cyan-500";
    default:
      return "bg-muted-foreground";
  }
};

export default function DiscussionCard({
  discussion,
}: {
  discussion: DiscussionWithZone;
}) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className="w-full hover:shadow-lg transition-shadow duration-300 border-l-4"
      style={{
        borderLeftColor: getDisasterColor(discussion.zone.disasterType).replace(
          "bg-",
          "#"
        ),
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`p-2.5 rounded-lg ${getDisasterColor(
                discussion.zone.disasterType
              )} text-primary-foreground`}
            >
              {getDisasterIcon(discussion.zone.disasterType)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold leading-tight mb-2">
                {discussion.zone.name}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {discussion.content}
              </p>
            </div>
          </div>

          {/* Danger Level */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getDangerLevelStyle(
              discussion.zone.dangerLevel
            )}`}
          >
            {discussion.zone.dangerLevel}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4">

          {/* Affected Users */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Affected Users</p>
              <p className="font-semibold">
                {discussion.zone.affectedUserLocations.length}
              </p>
            </div>
          </div>

          {/* Comments */}
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Comments</p>
              <p className="font-semibold">
                {discussion.comments?.length || 0}
              </p>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Created</p>
              <p className="font-medium text-foreground/70 text-xs">
                {formatDate(discussion.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Zone Description */}
        {discussion.zone.description && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {discussion.zone.description}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">

        {/* Status Badge (ACTIVE or INACTIVE) */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              discussion.zone.status === "ACTIVE"
                ? "bg-green-500/10 text-green-600 dark:text-green-500"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {discussion.zone.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        {/* View Discussion Button */}
        <Link href={`/discussions/${discussion.id}`}>
          <Button size="sm" className="gap-2">
            View Discussion
            <MessageSquare className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
