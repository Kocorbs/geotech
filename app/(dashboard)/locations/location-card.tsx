import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserLocation } from "@prisma/client";
import {
  Calendar,
  Edit,
  MapIcon,
  MapPin,
  MoreVertical,
  Navigation,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import DeleleteLocationButton from "./delete-button";

export function LocationCard({ location }: { location: UserLocation }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground truncate">
                {location.name}
              </h3>
            </div>
            {location.description && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {location.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Navigation className="w-4 h-4 mr-2" />
            <span className="font-mono text-xs">
              {formatCoordinates(location.latitude, location.longitude)}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Added {formatDate(location.createdAt.toString())}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Link
              href={`/locations/${location.id}`}
              className="flex items-center gap-2"
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Open
            </Link>
          </Button>
          <DeleleteLocationButton locationId={location.id} />
        </div>
      </CardContent>
    </Card>
  );
}
