import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { LocationCard } from "./location-card";
import { AddLocationBanner } from "./new/add-location";
import { auth } from "@/auth";
import { getUserLocations } from "@/actions/locations.action";

export default async function LocationsPage() {
  const session = await auth();
  if (!session) return;

  const locations = await getUserLocations(session.user.id);

  return (
    <main className="space-y-4 rounded-none">
      <SiteHeader title="Locations" />
      <section className="p-4">
        <AddLocationBanner />
      </section>
      <section>
        {locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center px-4">
            <h2 className="text-2xl font-semibold mb-4">No Locations Found</h2>
            <p className="text-gray-600 mb-6">
              You havent added any locations yet. Start by adding a new
              location.
            </p>
            <Button>Add Location</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-4">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
