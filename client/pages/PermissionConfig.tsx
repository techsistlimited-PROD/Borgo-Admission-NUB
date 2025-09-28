import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const ALL_PERMS = [
  "applications:view",
  "applications:approve",
  "applications:generate_id",
  "waivers:manage",
  "finance:view",
  "finance:billing",
  "reports:view",
  "messaging:send",
];

export default function PermissionConfig() {
  const { permissions, setPermissions } = useAuth();
  const [local, setLocal] = useState<string[]>(permissions || []);

  const toggle = (p: string) => {
    setLocal((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const save = () => {
    setPermissions(local);
    alert("Permissions updated (frontend-only)");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Permission Configuration (Frontend-only)</h1>
      <Card>
        <CardHeader>
          <CardTitle>Available Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_PERMS.map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input type="checkbox" checked={local.includes(p)} onChange={() => toggle(p)} />
                <span className="text-sm">{p}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setLocal(permissions || [])}>Reset</Button>
            <Button onClick={save} className="bg-deep-plum text-white">Save Permissions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
