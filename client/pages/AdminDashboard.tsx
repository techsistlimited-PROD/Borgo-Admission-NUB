import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import apiClient from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../hooks/use-toast";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const { toast } = useToast();

  const loadSummary = async () => {
    const res = await apiClient.getDashboardSummary();
    if (res.success) setSummary(res.data || {});
  };

  const loadStudents = async () => {
    try {
      const res = await apiClient.getStudents({ search, page, limit });
      if (res.success) setStudents(res.data.students || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadSummary(); }, []);
  useEffect(() => { loadStudents(); }, [search, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Admission Dashboard (Demo)</h2>
        <div className="flex items-center gap-2">
          <Button onClick={loadSummary}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card><CardHeader><CardTitle>Total Applications</CardTitle></CardHeader><CardContent className="p-4"><div className="text-2xl font-bold">{summary?.totalApplications ?? '—'}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Admitted</CardTitle></CardHeader><CardContent className="p-4"><div className="text-2xl font-bold">{summary?.admitted ?? '—'}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Students</CardTitle></CardHeader><CardContent className="p-4"><div className="text-2xl font-bold">{summary?.totalStudents ?? '—'}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Recent Visitors (30d)</CardTitle></CardHeader><CardContent className="p-4"><div className="text-2xl font-bold">{summary?.recentVisitors ?? '—'}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Students</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Input placeholder="Search students by name/ID/email" value={search} onChange={(e:any)=>setSearch(e.target.value)} />
              <Button onClick={() => { setPage(1); loadStudents(); }}>Search</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Batch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.student_id}>
                    <TableCell>{s.university_id || s.student_id}</TableCell>
                    <TableCell>{s.full_name}</TableCell>
                    <TableCell>{s.program_code}</TableCell>
                    <TableCell>{s.batch}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex justify-between">
              <Button onClick={() => setPage((p)=>Math.max(1,p-1))}>Prev</Button>
              <div>Page {page}</div>
              <Button onClick={() => setPage((p)=>p+1)}>Next</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Metrics</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>Total Waiver Assignments: {summary?.totalWaiverAssignments ?? '—'}</div>
              <div>Total Waiver % (sum): {summary?.totalWaiverPercent ?? '—'}</div>
              <div>Total Collected: {summary?.totalCollected ?? '—'}</div>
              <div>Active Students: {summary?.activeStudents ?? '—'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
