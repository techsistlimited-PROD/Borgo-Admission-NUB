import { useEffect, useState } from "react";
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

const DEMO_USERS = [
  { id: 1, name: "Admin User", email: "admin@nu.edu.bd", role: "admin" },
  {
    id: 3,
    name: "Admission Officer",
    email: "admission@nu.edu.bd",
    role: "admission_officer",
  },
  {
    id: 4,
    name: "Finance Officer",
    email: "finance@nu.edu.bd",
    role: "finance_officer",
  },
];

export default function PermissionConfig() {
  const { permissions, setPermissions, role: currentRole, setRole } = useAuth();

  // Load persisted role and user permission maps from localStorage (frontend-only)
  const [rolePerms, setRolePerms] = useState<Record<string, string[]>>(() => {
    try {
      const raw = localStorage.getItem("nu_role_permissions");
      return raw
        ? JSON.parse(raw)
        : {
            admission_officer: [
              "applications:view",
              "applications:approve",
              "waivers:manage",
            ],
            finance_officer: [
              "finance:view",
              "finance:billing",
              "reports:view",
            ],
          };
    } catch {
      return {
        admission_officer: [
          "applications:view",
          "applications:approve",
          "waivers:manage",
        ],
        finance_officer: ["finance:view", "finance:billing", "reports:view"],
      };
    }
  });

  const [userPerms, setUserPerms] = useState<Record<number, string[]>>(() => {
    try {
      const raw = localStorage.getItem("nu_user_permissions");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // UI state
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    // Ensure current auth permissions reflect selected role (if any) on mount
    if (currentRole && rolePerms[currentRole]) {
      setPermissions(rolePerms[currentRole]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRolePerm = (r: string, p: string) => {
    setRolePerms((prev) => {
      const cur = new Set(prev[r] || []);
      if (cur.has(p)) cur.delete(p);
      else cur.add(p);
      const updated = { ...prev, [r]: Array.from(cur) };
      localStorage.setItem("nu_role_permissions", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleUserPerm = (uid: number, p: string) => {
    setUserPerms((prev) => {
      const cur = new Set(prev[uid] || []);
      if (cur.has(p)) cur.delete(p);
      else cur.add(p);
      const updated = { ...prev, [uid]: Array.from(cur) };
      localStorage.setItem("nu_user_permissions", JSON.stringify(updated));
      return updated;
    });
  };

  const applyRoleToAuth = (r: string) => {
    // Apply role perms to auth context (frontend-only)
    const p = rolePerms[r] || [];
    setPermissions(p);
    setRole(r);
    alert(`Applied permissions for role: ${r} (frontend-only)`);
  };

  const applyUserToAuth = (u: any) => {
    // If user has explicit perms, apply them; otherwise apply role perms
    const explicit = userPerms[u.id];
    const p = explicit && explicit.length ? explicit : rolePerms[u.role] || [];
    setPermissions(p);
    setRole(u.role);
    alert(`Applied permissions for user: ${u.name} (frontend-only)`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Permission Configuration</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">
              Toggle permissions for roles. These are applied to users who don't
              have explicit overrides.
            </p>
            <div className="space-y-4">
              {Object.keys(rolePerms).map((r) => (
                <div key={r} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      {r === "admission_officer"
                        ? "Admission Officer"
                        : r === "finance_officer"
                          ? "Finance Officer"
                          : r}
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyRoleToAuth(r)}
                      >
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          localStorage.setItem(
                            "nu_role_permissions",
                            JSON.stringify(rolePerms),
                          );
                          alert("Saved role permissions (frontend-only)");
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_PERMS.map((p) => (
                      <label key={p} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(rolePerms[r] || []).includes(p)}
                          onChange={() => toggleRolePerm(r, p)}
                        />
                        <span className="text-sm">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">
              Select a user to view or override their permissions. Overrides
              take precedence over role permissions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ul className="space-y-2">
                  {DEMO_USERS.map((u) => (
                    <li
                      key={u.id}
                      className={`p-2 rounded cursor-pointer ${selectedUserId === u.id ? "bg-gray-100" : ""}`}
                      onClick={() => setSelectedUserId(u.id)}
                    >
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-gray-500">
                        {u.email} • {u.role}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {selectedUserId ? (
                  (() => {
                    const u = DEMO_USERS.find((x) => x.id === selectedUserId)!;
                    const effective =
                      userPerms[u.id] && userPerms[u.id].length
                        ? userPerms[u.id]
                        : rolePerms[u.role] || [];
                    return (
                      <div>
                        <div className="mb-2 font-medium">
                          Editing: {u.name}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          Role: {u.role}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {ALL_PERMS.map((p) => (
                            <label key={p} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={effective.includes(p)}
                                onChange={() => toggleUserPerm(u.id, p)}
                              />
                              <span className="text-sm">{p}</span>
                            </label>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUserId(null)}
                          >
                            Close
                          </Button>
                          <Button
                            onClick={() => {
                              localStorage.setItem(
                                "nu_user_permissions",
                                JSON.stringify(userPerms),
                              );
                              alert("Saved user permissions (frontend-only)");
                            }}
                          >
                            Save Override
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => applyUserToAuth(u)}
                          >
                            Apply to Auth
                          </Button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-sm text-gray-500">
                    Select a user to edit permissions.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Note: This is a frontend-only demo. To make this persistent and secure,
        connect a backend (Neon/Supabase) and store role/user permission
        mappings in the database. You can connect MCPs via the Open MCP popover.
      </div>
    </div>
  );
}
