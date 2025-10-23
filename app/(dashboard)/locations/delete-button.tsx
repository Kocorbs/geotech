"use client";

import { deleteUserLocation } from "@/actions/locations.action";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleleteLocationButton({
  locationId,
}: {
  locationId: number;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUserLocation(locationId);
      toast.success("Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.success("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={loading}
      size="sm"
      onClick={handleDelete}
      className="px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
