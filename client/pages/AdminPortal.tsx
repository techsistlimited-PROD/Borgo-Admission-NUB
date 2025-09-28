import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function AdminPortal() {
  const { user, role } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Portal</h1>
        <div className="text-sm text-gray-600">Signed in as: {user?.name} ({role || user?.type})</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Admission Officer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Access to application review, waivers, offer courses, student management.</p>
            <div className="mt-4 flex gap-2">
              <Link to="/admin/admissions"><Button>Applications</Button></Link>
              <Link to="/admin/waivers"><Button variant="outline">Waivers</Button></Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Finance Officer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Access billing, money receipts, fee structure, payments.</p>
            <div className="mt-4 flex gap-2">
              <Link to="/admin/finance"><Button>Finance Panel</Button></Link>
              <Link to="/admin/id-card-generation"><Button variant="outline">ID Cards</Button></Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Centralized admission settings and user permission configuration.</p>
            <div className="mt-4 flex gap-2">
              <Link to="/admin/configuration"><Button>Admission Settings</Button></Link>
              <Link to="/admin/users"><Button variant="outline">Users & Permissions</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
