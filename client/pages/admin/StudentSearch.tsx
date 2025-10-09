import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import { departments, getProgramById } from "@/lib/programData";
import { Link } from "react-router-dom";

export default function StudentSearch() {
  const { toast } = useToast();

  // Filters
  const [anyText, setAnyText] = useState("");
  const [cellNumber, setCellNumber] = useState("");
  const [studentId, setStudentId] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [admissionSemester, setAdmissionSemester] = useState("");
  const [programCode, setProgramCode] = useState("");
  const [campus, setCampus] = useState("");

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Results
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [total, setTotal] = useState(0);

  // Sorting
  const [sortField, setSortField] = useState<string>("full_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const campusOptions = [
    { id: "", name: "All Campuses" },
    { id: "Main Campus", name: "Main Campus" },
    { id: "Khulna Campus", name: "Khulna Campus" },
  ];

  const programOptions = departments.map((d) => ({ id: d.id, name: d.name }));

  const runSearch = async (p = 1) => {
    setLoading(true);
    setPage(p);
    try {
      // Priority exact lookups
      if (studentId) {
        // Student ID exact lookup (numeric id)
        const sid = Number(studentId);
        const res = await apiClient.getStudent(sid);
        if (res.success) {
          setResults([res.data]);
          setTotal(1);
        } else {
          setResults([]);
          setTotal(0);
          toast({
            title: "Not found",
            description: "No student found for that ID",
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      }

      // Build params for listing
      const params: any = { page: p, limit };

      // If exact unique ID provided -> use search then filter exact
      if (uniqueId) params.search = uniqueId;
      else if (cellNumber) params.search = cellNumber;
      else if (studentName) params.search = studentName;
      else if (anyText) params.search = anyText;

      if (programCode) params.program_code = programCode;
      if (admissionSemester) params.semester = admissionSemester; // server may use semester_id; mock accepts semester string
      if (campus) params.campus = campus;

      const res = await apiClient.getStudents(params);
      if (!res.success) throw new Error(String(res.error || "Failed to load"));

      let students: any[] = res.data?.students || [];
      const totalRes = res.data?.total ?? students.length;

      // Apply exact-match filters client-side where required
      if (uniqueId)
        students = students.filter((s) => (s.ugc_id || "") === uniqueId);
      if (cellNumber)
        students = students.filter(
          (s) => (s.mobile_number || "") === cellNumber,
        );
      if (studentName) {
        const q = studentName.toLowerCase();
        students = students.filter((s) =>
          (s.full_name || "").toLowerCase().includes(q),
        );
      }

      // Sorting client-side
      students.sort((a, b) => {
        const av = (a[sortField] || "").toString().toLowerCase();
        const bv = (b[sortField] || "").toString().toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });

      setResults(students);
      setTotal(totalRes);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error",
        description: String(e.message || e),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setAnyText("");
    setCellNumber("");
    setStudentId("");
    setUniqueId("");
    setStudentName("");
    setAdmissionSemester("");
    setProgramCode("");
    setCampus("");
    setResults([]);
    setTotal(0);
    setPage(1);
  };

  useEffect(() => {
    // default initial load (empty) - do not auto-run
  }, []);

  const changeSort = (field: string) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Student Search</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="md:col-span-2">
              <Label>Any detail</Label>
              <Input
                placeholder="Search by any detail..."
                value={anyText}
                onChange={(e: any) => setAnyText(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button onClick={() => runSearch(1)}>Search</Button>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdvanced((s) => !s)}
                  >
                    {showAdvanced ? "Hide Filters" : "Advanced Filters"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {showAdvanced && (
            <div className="border rounded p-3 mb-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Cell Number</Label>
                  <Input
                    placeholder="Enter Mobile Number"
                    value={cellNumber}
                    onChange={(e: any) => setCellNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Student ID</Label>
                  <Input
                    placeholder="Enter Student ID"
                    value={studentId}
                    onChange={(e: any) => setStudentId(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Unique ID (UGC)</Label>
                  <Input
                    placeholder="Enter UGC/Unique ID"
                    value={uniqueId}
                    onChange={(e: any) => setUniqueId(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Student Name</Label>
                  <Input
                    placeholder="Enter Full or Partial Name"
                    value={studentName}
                    onChange={(e: any) => setStudentName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Admission Semester</Label>
                  <Select
                    value={admissionSemester}
                    onValueChange={(v: any) => setAdmissionSemester(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                      <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                      <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Program</Label>
                  <Select
                    value={programCode}
                    onValueChange={(v: any) => setProgramCode(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Programs</SelectItem>
                      {programOptions.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Campus</Label>
                  <Select
                    value={campus}
                    onValueChange={(v: any) => setCampus(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campusOptions.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-gray-600 mb-2">
              Results: {total} — Page {page}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => changeSort("student_id")}
                    className="cursor-pointer"
                  >
                    Student ID
                  </TableHead>
                  <TableHead>Unique ID (UGC)</TableHead>
                  <TableHead
                    onClick={() => changeSort("full_name")}
                    className="cursor-pointer"
                  >
                    Student Name
                  </TableHead>
                  <TableHead
                    onClick={() => changeSort("program_code")}
                    className="cursor-pointer"
                  >
                    Program
                  </TableHead>
                  <TableHead>Admission Semester</TableHead>
                  <TableHead>Campus</TableHead>
                  <TableHead>Mobile Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((s: any) => (
                  <TableRow key={s.student_id}>
                    <TableCell>{s.student_id}</TableCell>
                    <TableCell>{s.ugc_id || s.university_id || "-"}</TableCell>
                    <TableCell>{s.full_name || "-"}</TableCell>
                    <TableCell>
                      {getProgramById(s.program_code || "")?.name ||
                        s.program_code ||
                        "-"}
                    </TableCell>
                    <TableCell>{s.batch || s.semester || "-"}</TableCell>
                    <TableCell>{s.campus || "-"}</TableCell>
                    <TableCell>{s.mobile_number || "-"}</TableCell>
                    <TableCell>{s.is_active ? "Active" : "Inactive"}</TableCell>
                    <TableCell>
                      <Link
                        to={`/admin/student-profile?id=${s.student_id}`}
                        className="text-deep-plum hover:underline"
                      >
                        View Profile
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <Button
                  onClick={() => runSearch(Math.max(1, page - 1))}
                  disabled={page <= 1 || loading}
                >
                  Prev
                </Button>
                <Button
                  className="ml-2"
                  onClick={() => runSearch(page + 1)}
                  disabled={page * limit >= total || loading}
                >
                  Next
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                Showing {results.length} of {total}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
