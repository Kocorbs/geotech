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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  changeZoneStatus,
  deleteZone,
  updateZone,
} from "@/actions/zone.action";

export default function ZoneTable({ zones }: { zones: any[] }) {
  const [zoneList, setZoneList] = useState(zones);
  const [editingZone, setEditingZone] = useState<any | null>(null);

  const handleStatusChange = async (zoneId: number, newStatus: string) => {
    setZoneList((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, status: newStatus } : z))
    );
    await changeZoneStatus(zoneId, newStatus);
    console.log(`Zone ${zoneId} status changed to ${newStatus}`);
  };

  const handleDelete = async (zoneId: number) => {
    console.log(`Delete zone ${zoneId}`);
    await deleteZone(zoneId);
    setZoneList((prev) => prev.filter((z) => z.id !== zoneId));
  };

  const handleSave = async (updatedData: any) => {
    console.log(updatedData);

    const formData = new FormData();
    formData.append("id", updatedData.id);
    formData.append("name", updatedData.name);
    formData.append("description", updatedData.description || "");

    await updateZone(updatedData.id, formData);

    setZoneList((prev) =>
      prev.map((z) => (z.id === updatedData.id ? updatedData : z))
    );
    setEditingZone(null);
  };

  return (
    <div className="rounded-2xl border shadow-sm bg-card m-4">
      <Table>
        <TableCaption>A list of all created zones.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Disaster Type</TableHead>
            <TableHead>Danger Level</TableHead>
            <TableHead>Affected Locations</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {zoneList?.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell className="font-medium">{zone.name}</TableCell>
              <TableCell>{zone.description ?? "-"}</TableCell>
              <TableCell>
                <Badge variant="outline">{zone.disasterType}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    zone.dangerLevel === "HIGH"
                      ? "bg-red-500 text-white"
                      : zone.dangerLevel === "MEDIUM"
                      ? "bg-orange-500 text-white"
                      : "bg-green-500 text-white"
                  }
                >
                  {zone.dangerLevel}
                </Badge>
              </TableCell>
              <TableCell>{zone.affectedUserLocations?.length ?? 0}</TableCell>
              <TableCell>
                <Select
                  value={zone.status}
                  onValueChange={(val) => handleStatusChange(zone.id, val)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="RESOLVED">INACTIVE</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-2 rounded">
                      <MoreHorizontal size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingZone(zone)}>
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
      {editingZone && (
        <Dialog open={!!editingZone} onOpenChange={() => setEditingZone(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Zone</DialogTitle>
              <DialogDescription>
                Update zone information below.
              </DialogDescription>
            </DialogHeader>

            <AdminMapForm
              formType="zone"
              defaultValues={editingZone}
              onChange={(data) => setEditingZone(data)}
            />

            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditingZone(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleSave(editingZone)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
