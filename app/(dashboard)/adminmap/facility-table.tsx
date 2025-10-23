"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminMapForm from "./admin-map-form";
import { Button } from "@/components/ui/button";
import { Facility } from "@prisma/client";
import { deleteFacility, updateFacility } from "@/actions/facility.action";

export default function FacilityTable({
  facilities,
}: {
  facilities: Facility[];
}) {
  const [facilityList, setFacilityList] = useState(facilities);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);

  const handleDelete = async (zoneId: number) => {
    console.log(`Delete zone ${zoneId}`);
    await deleteFacility(zoneId);
    setFacilityList((prev) => prev.filter((z) => z.id !== zoneId));
  };

  const handleSave = async (updatedData: any) => {
    console.log(updatedData);

    const formData = new FormData();
    formData.append("id", updatedData.id);
    formData.append("name", updatedData.name);
    formData.append("type", updatedData.type);

    await updateFacility(updatedData.id, formData);

    setFacilityList((prev) =>
      prev.map((z) => (z.id === updatedData.id ? updatedData : z))
    );
    setEditingFacility(null);
  };

  return (
    <div className="rounded-2xl border shadow-sm bg-card m-4">
      <Table>
        <TableCaption>A list of all created facilities.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {facilityList?.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell className="font-medium">{zone.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{zone.type}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-2 rounded">
                      <MoreHorizontal size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingFacility(zone)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(zone.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingFacility && (
        <Dialog
          open={!!editingFacility}
          onOpenChange={() => setEditingFacility(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Zone</DialogTitle>
              <DialogDescription>
                Update zone information below.
              </DialogDescription>
            </DialogHeader>

            <AdminMapForm
              formType="facility"
              defaultValues={editingFacility}
              onChange={(data) => setEditingFacility(data)}
            />

            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditingFacility(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleSave(editingFacility)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
