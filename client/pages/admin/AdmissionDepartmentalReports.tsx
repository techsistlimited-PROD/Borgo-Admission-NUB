import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { departments, getProgramById } from "@/lib/programData";

const leftTabs = [
  "Program-wise Admitted Students",
  "Fee Collection Reports",
  "Admission Flowcharts",
  "Student Lists",
  "Waiver Reports",
  "Admission Targets",
  "Feeder Districts",
  "Credit Transfer Students",
];

const sampleProgramWise = [
  { serial: 1, programCode: "CSE101", programName: "Computer Science & Engineering", male: 89, female: 67, total: 156, semester: "Spring 2024", year: 2024 },
  { serial: 2, programCode: "EEE101", programName: "Electrical & Electronic Engineering", male: 78, female: 45, total: 123, semester: "Spring 2024", year: 2024 },
  { serial: 3, programCode: "CIV101", programName: "Civil Engineering", male: 92, female: 34, total: 126, semester: "Spring 2024", year: 2024 },
  { serial: 4, programCode: "BBA101", programName: "Bachelor of Business Administration", male: 65, female: 98, total: 163, semester: "Spring 2024", year: 2024 },
];

export default function AdmissionDepartmentalReports() {
  const [activeTab, setActiveTab] = useState(leftTabs[0]);

  // Filters for program-wise
  const [semester, setSemester] = useState("__all");
  const [program, setProgram] = useState("__all");
  const [year, setYear] = useState<string | number>(2024);

  const semesters = ["", "Spring 2024", "Summer 2024", "Fall 2024", "Spring 2025"];
  const years = [2022, 2023, 2024, 2025];
  const programOptions = departments.map((d) => ({ id: d.id, name: d.name }));

  const filteredProgramWise = useMemo(() => {
    let list = sampleProgramWise.slice();
    if (semester && semester !== "__all") list = list.filter((r) => r.semester === semester);
    if (program && program !== "__all") list = list.filter((r) => r.programCode === program);
    if (year) list = list.filter((r) => r.year === Number(year));
    return list;
  }, [semester, program, year]);

  const exportPdf = (context = "") => {
    // Placeholder: open print dialog as simple PDF export
    console.log("Export PDF for", context);
    window.print();
  };

  const exportExcel = (context = "") => {
    // Placeholder: create CSV and trigger download
    const rows = [["Serial", "Program Name", "Male", "Female", "Total"]];
    filteredProgramWise.forEach((r) => rows.push([r.serial, r.programName, r.male, r.female, r.total]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `program-wise-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Admission Departmental Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left Accordion / Tabs */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {leftTabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`w-full text-left px-3 py-2 rounded ${activeTab === t ? "bg-deep-plum text-white" : "hover:bg-gray-100 text-gray-700"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="col-span-1 md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Program-wise Admitted Students per Semester */}
              {activeTab === "Program-wise Admitted Students" && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <div>
                      <Label>Semester</Label>
                      <Select value={semester} onValueChange={(v: any) => setSemester(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all">All</SelectItem>
                          {semesters.filter(s=>s).map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Program</Label>
                      <Select value={program} onValueChange={(v: any) => setProgram(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all">All Programs</SelectItem>
                          {programOptions.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Year</Label>
                      <Select value={String(year)} onValueChange={(v: any) => setYear(Number(v))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((y) => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end gap-2">
                      <Button onClick={() => { /* show annex-wise */ }}>
                        Annex-wise Admitted Students Number
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="space-x-2">
                      <Button onClick={() => exportPdf('program-wise')}>Export as PDF</Button>
                      <Button variant="outline" onClick={() => exportExcel('program-wise')}>Export as Excel</Button>
                    </div>
                    <div className="text-sm text-gray-600">Showing {filteredProgramWise.length} records</div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial</TableHead>
                        <TableHead>Program Name</TableHead>
                        <TableHead>Male</TableHead>
                        <TableHead>Female</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProgramWise.map((r) => (
                        <TableRow key={r.serial}>
                          <TableCell>{r.serial}</TableCell>
                          <TableCell>{r.programName}</TableCell>
                          <TableCell>{r.male}</TableCell>
                          <TableCell>{r.female}</TableCell>
                          <TableCell>{r.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                </div>
              )}

              {/* Placeholder content for other tabs */}
              {activeTab === "Fee Collection Reports" && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Employee-wise admission fee collection and daily reports.</p>
                  <Button onClick={() => exportPdf('fee-collection')}>Export as PDF</Button>
                </div>
              )}

              {activeTab === "Admission Flowcharts" && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Flowchart visualization and options to export as image/PDF.</p>
                  <Button onClick={() => exportPdf('flowchart')}>Export as Image/PDF</Button>
                </div>
              )}

              {activeTab === "Student Lists" && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Student lists with filters and export options.</p>
                </div>
              )}

              {activeTab === "Waiver Reports" && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Waiver amounts and summaries.</p>
                </div>
              )}

              {activeTab === "Admission Targets" && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Set and view admission targets.</p>
                </div>
              )}

              {activeTab === "Feeder Districts" && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Feeder district reports with program breakdown.</p>
                </div>
              )}

              {activeTab === "Credit Transfer Students" && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Credit transfer student lists and exports.</p>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
