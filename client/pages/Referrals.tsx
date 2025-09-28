import React, { useEffect, useState } from "react";
import { Download, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../hooks/use-toast";
import apiClient from "../lib/api";

export default function Referrals() {
  const { toast } = useToast();
  const [referrers, setReferrers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getReferrers();
      if (res.success && res.data) {
        setReferrers(res.data.referrers || []);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load referrers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const exportCSV = (rows: any[], filename = "referrers.csv") => {
    if (!rows || rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const lines = [keys.join(",")];
    for (const r of rows) {
      lines.push(keys.map((k) => '"' + (r[k] ?? "") + '"').join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    exportCSV(referrers.map(r => ({ employee_id: r.employee_id, name: r.name, department: r.department, designation: r.designation })));
    toast({ title: "Exported", description: "CSV generated" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-plum">Referrals</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2"/>Export</Button>
          <Button className="bg-deep-plum"><BarChart2 className="w-4 h-4 mr-2"/>Reports</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referrers ({referrers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrers.map((r: any) => (
                <TableRow key={r.employee_id}>
                  <TableCell>{r.employee_id}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.department}</TableCell>
                  <TableCell>{r.designation}</TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">View reports in Reports page</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
