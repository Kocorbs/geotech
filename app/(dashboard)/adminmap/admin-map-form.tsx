"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

type FormType = "facility" | "zone";

interface AdminMapFormProps {
  formType: FormType;
  defaultValues?: any;
  onChange: (data: any) => void;
}

export default function AdminMapForm({
  formType,
  defaultValues = {},
  onChange,
}: AdminMapFormProps) {
  const [formData, setFormData] = useState<any>(defaultValues);

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  return (
    <div className="space-y-5 p-2">
      {/* FACILITY FORM */}
      {formType === "facility" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="facility-name">Facility Name</Label>
            <Input
              id="facility-name"
              placeholder="Enter facility name"
              defaultValue={defaultValues?.name || ""}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="facility-type">Facility Type</Label>
            <Select
              defaultValue={defaultValues?.type}
              onValueChange={(v) =>
                setFormData((prev: any) => ({
                  ...prev,
                  type: v,
                }))
              }
            >
              <SelectTrigger id="facility-type">
                <SelectValue placeholder="Select facility type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOSPITAL">🏥 Hospital</SelectItem>
                <SelectItem value="CLINIC">🩺 Clinic</SelectItem>
                <SelectItem value="FIRESTATION">🔥 Fire Station</SelectItem>
                <SelectItem value="POLICE">👮 Police Station</SelectItem>
                <SelectItem value="EVAC_CENTER">
                  🏚️ Evacuation Center
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* ZONE FORM */}
      {formType === "zone" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="zone-name">Zone Name</Label>
            <Input
              id="zone-name"
              placeholder="Enter zone name"
              defaultValue={defaultValues?.name || ""}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="zone-description">Description</Label>
            <Textarea
              id="zone-description"
              placeholder="Briefly describe this zone (e.g., location, boundaries, or impact area)"
              defaultValue={defaultValues?.description || ""}
              className="min-h-24 resize-none"
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="disaster-type">Disaster Type</Label>
              <Select
                defaultValue={defaultValues?.disasterType}
                onValueChange={(v) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    disasterType: v,
                  }))
                }
              >
                <SelectTrigger id="disaster-type">
                  <SelectValue placeholder="Select disaster type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FLOOD">🌊 Flood</SelectItem>
                  <SelectItem value="FIRE">🔥 Fire</SelectItem>
                  <SelectItem value="EARTHQUAKE">🌋 Earthquake</SelectItem>
                  <SelectItem value="LANDSLIDE">⛰️ Landslide</SelectItem>
                  <SelectItem value="TYPHOON">💨 Typhoon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="danger-level">Danger Level</Label>
              <Select
                defaultValue={defaultValues?.dangerLevel}
                onValueChange={(v) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    dangerLevel: v,
                  }))
                }
              >
                <SelectTrigger id="danger-level">
                  <SelectValue placeholder="Select danger level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">🟡 Low</SelectItem>
                  <SelectItem value="MEDIUM">🟠 Medium</SelectItem>
                  <SelectItem value="HIGH">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
