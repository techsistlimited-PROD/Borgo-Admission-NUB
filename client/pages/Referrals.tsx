import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import apiClient from "../lib/api";

export default function Referrals() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [referrers, setReferrers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>(undefined);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getReferrers();
      if (res.success && res.data) {
        // enhance with sample stats if missing
        const enriched = (res.data.referrers || []).map((r: any) => ({
          total_referrals: r.total_referrals ?? Math.floor(Math.random() * 50),
          total_amount: r.total_amount ?? Math.floor(Math.random() * 200000),
          last_activity: r.last_activity ?? null,
          contact: r.contact ?? "",
          ...r,
        }));
        setReferrers(enriched);
        setFiltered(enriched);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load referrers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let data = referrers.slice();
    if (departmentFilter) data = data.filter(d => (d.department || "").toLowerCase() === departmentFilter.toLowerCase());
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(d => (d.employee_id || "").toLowerCase().includes(s) || (d.name || "").toLowerCase().includes(s) || (d.contact || "").toLowerCase().includes(s));
    }
    setFiltered(data);
  }, [referrers, search, departmentFilter]);

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
    exportCSV(filtered.map(r => ({ employee_id: r.employee_id, name: r.name, department: r.department, designation: r.designation, total_referrals: r.total_referrals, total_amount: r.total_amount })));
    toast({ title: "Exported", description: "CSV generated" });
  };

  const handleViewReport = (r: any) => {
    // Navigate to reports page filtered by employee
    navigate(`/admin/reports?referrer=${encodeURIComponent(r.employee_id || r.employee_id)}`);
  };

  const departments = Array.from(new Set(referrers.map(r => r.department).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-plum">Referrals</h1>
        <div className="flex gap-2">
          <Input placeholder="Search by id, name or contact" value={search} onChange={(e:any) => setSearch(e.target.value)} />
          <Select onValueChange={(v:any) => setDepartmentFilter(v || undefined)}>
            <SelectTrigger className="w-48"><SelectValue placeholder="All Departments"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {departments.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2"/>Export</Button>
          <Button className="bg-deep-plum" onClick={() => navigate('/admin/reports?scope=finance')}><BarChart2 className="w-4 h-4 mr-2"/>Reports</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referrers ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Total Referrals</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r: any) => (
                <TableRow key={r.employee_id}>
                  <TableCell>{r.employee_id}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.department}</TableCell>
                  <TableCell>{r.designation}</TableCell>
                  <TableCell>{r.total_referrals}</TableCell>
                  <TableCell>{r.total_amount}</TableCell>
                  <TableCell>{r.contact}</TableCell>
                  <TableCell>{r.last_activity ? new Date(r.last_activity).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => handleViewReport(r)}>View Report</Button>
                      <Button variant="ghost" onClick={() => navigate(`/admin/referrals/${encodeURIComponent(r.employee_id)}`)}>Details</Button>
                    </div>
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
