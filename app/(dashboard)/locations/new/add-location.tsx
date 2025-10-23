"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Navigation, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

// Simple floating action button version
export function AddLocationFAB() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/locations/new")}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
    >
      <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
      <span className="sr-only">Add new location</span>
    </Button>
  );
}

// Prominent call-to-action card
export function AddLocationCard() {
  const router = useRouter();

  return (
    <Card
      className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
      onClick={() => router.push("/locations/new")}
    >
      <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
          <div className="relative bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
            <MapPin className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            Add New Location
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Save your favorite places and get weather updates for any location
            around the world
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Quick & Easy
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Navigation className="w-3 h-3 mr-1" />
            GPS Ready
          </Badge>
        </div>

        <Button className="mt-4 group-hover:shadow-md transition-shadow duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </CardContent>
    </Card>
  );
}

// Inline button for headers or toolbars
export function AddLocationButton({
  variant = "default",
  size = "default",
  className = "",
}: {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => router.push("/locations/new")}
      className={`gap-2 ${className}`}
    >
      <Plus className="h-4 w-4" />
      Add Location
    </Button>
  );
}

// Hero-style banner component
export function AddLocationBanner() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
                New Feature
              </Badge>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Discover Weather Anywhere
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Add your favorite locations and get instant weather updates.
                Perfect for travel planning, family connections, or just staying
                curious about the world.
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => router.push("/locations/new")}
            className="shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Location
          </Button>
        </div>
      </div>
    </div>
  );
}

// Usage Examples Component (for demonstration)
export function AddLocationExamples() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          1. Floating Action Button (FAB)
        </h3>
        <div className="relative h-32 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
          <AddLocationFAB />
          <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            FAB appears in bottom-right corner
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">2. Call-to-Action Card</h3>
        <AddLocationCard />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">3. Inline Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <AddLocationButton />
          <AddLocationButton variant="outline" />
          <AddLocationButton variant="secondary" />
          <AddLocationButton variant="ghost" size="sm" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">4. Hero Banner</h3>
        <AddLocationBanner />
      </div>
    </div>
  );
}
