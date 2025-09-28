import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Simple mock user list - in real app this would come from server
const DEMO_USERS = [
  { id: 1, name: "Admin User", email: "admin@nu.edu.bd", role: "admin" },
  { id: 3, name: "Admission Officer", email: "admission@nu.edu.bd", role: "admission_officer" },
  { id: 4, name: "Finance Officer", email: "finance@nu.edu.bd", role: "finance_officer" },
];

export default function AdminUsers() {
  const { role, setRole, setPermissions } = useAuth();
  const [users, setUsers] = useState(DEMO_USERS);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    // noop for now
  }, []);

  const saveRole = () => {
    if (!selectedUser) return;
    // update local mock list
    setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, role: selectedRole } : u)));
    // If editing self, persist role to auth context (frontend-only)
    if (selectedUser.email === "admin@nu.edu.bd") {
      setRole(selectedRole);
      // setPermissions based on role (demo)
      if (selectedRole === "admin") setPermissions(["all"]);
      else if (selectedRole === "admission_officer") setPermissions(["applications:view","applications:approve","waivers:manage"]);
      else if (selectedRole === "finance_officer") setPermissions(["finance:view","finance:billing"]);
    }
    alert("Role saved (frontend-only)");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Users & Roles (Frontend-only)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email} • {u.role}</div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(u); setSelectedRole(u.role); }}>Edit</Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit Role</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div>
                <div className="mb-2 text-sm">Editing: {selectedUser.name}</div>
                <select className="w-full border rounded-md p-2" value={selectedRole || ""} onChange={(e:any)=>setSelectedRole(e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="admission_officer">Admission Officer</option>
                  <option value="finance_officer">Finance Officer</option>
                </select>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" onClick={()=>{setSelectedUser(null); setSelectedRole(null);}}>Cancel</Button>
                  <Button onClick={saveRole} className="bg-deep-plum text-white">Save Role</Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Select a user to edit their role.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
