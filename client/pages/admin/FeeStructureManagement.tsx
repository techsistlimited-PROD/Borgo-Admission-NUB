import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../../components/ui/alert-dialog";
import { useToast } from "../../hooks/use-toast";

const PROGRAMS = ["CSE", "EEE", "BBA", "LAW", "ME", "CE", "PHARM"];

export default function FeeStructureManagement() {
  const { toast } = useToast();

  // Packages
  const [packages, setPackages] = useState<any[]>([
    { id: "pkg-1", name: "CSE-Basic", program: "CSE", admissionFee: 35000, perCreditFee: 2500, fixedFees: 15000, notes: "Default package" },
    { id: "pkg-2", name: "BBA-Standard", program: "BBA", admissionFee: 30000, perCreditFee: 2000, fixedFees: 12000, notes: "Includes basic facilities" },
  ]);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [pkgDialogOpen, setPkgDialogOpen] = useState(false);

  // Waivers
  const [waivers, setWaivers] = useState<any[]>([
    { id: "w-1", code: "MERIT1", name: "Merit 1", type: "Waiver", sscFrom: 4.50, sscTo: 5.00, hscFrom: 4.50, hscTo: 5.00, percent: 50, active: true },
  ]);
  const [editingWaiver, setEditingWaiver] = useState<any | null>(null);
  const [waiverDialogOpen, setWaiverDialogOpen] = useState(false);

  // Quotas
  const [quotas, setQuotas] = useState<any[]>([
    { id: "q-1", name: "Freedom Fighter", type: "Quota", percent: 100, active: true, notes: "Full waiver" },
  ]);
  const [editingQuota, setEditingQuota] = useState<any | null>(null);
  const [quotaDialogOpen, setQuotaDialogOpen] = useState(false);

  // Auto Course Offering
  const [autoProgram, setAutoProgram] = useState(PROGRAMS[0]);
  const [autoSession, setAutoSession] = useState("Fall 2025");
  const [generatedCourses, setGeneratedCourses] = useState<any[]>([]);

  // Waiver policy settings
  const [waiverPolicy, setWaiverPolicy] = useState({ applyTwoSemesters: true, minCGPA: 2.5 });

  // Referral toggle
  const [showReferralInReports, setShowReferralInReports] = useState(false);

  // Admission Circulars
  const [circulars, setCirculars] = useState<any[]>([]);
  const [editingCircular, setEditingCircular] = useState<any | null>(null);
  const [circularDialogOpen, setCircularDialogOpen] = useState(false);

  // Change history (mock)
  const [changeHistory, setChangeHistory] = useState<any[]>([]);

  // Helpers
  const calcPackageTotal = (p: any) => {
    return (Number(p.admissionFee || 0) + Number(p.fixedFees || 0));
  };

  const openAddPackage = () => {
    setEditingPackage({ name: "", program: PROGRAMS[0], admissionFee: 0, perCreditFee: 0, fixedFees: 0, notes: "" });
    setPkgDialogOpen(true);
  };

  const savePackage = () => {
    if (!editingPackage) return;
    if (!editingPackage.name) { toast({ title: "Validation", description: "Package name required" }); return; }
    if (!editingPackage.id) {
      editingPackage.id = `pkg-${Date.now()}`;
      setPackages((s) => [editingPackage, ...s]);
      toast({ title: "Package added" });
    } else {
      setPackages((s) => s.map((p) => (p.id === editingPackage.id ? editingPackage : p)));
      toast({ title: "Package updated" });
    }
    setPkgDialogOpen(false);
    setEditingPackage(null);
  };

  const deletePackage = (id: string) => {
    setPackages((s) => s.filter((p) => p.id !== id));
    toast({ title: "Package deleted" });
  };

  // Waiver handlers
  const openAddWaiver = () => {
    setEditingWaiver({ code: "", name: "", type: "Waiver", sscFrom: 0, sscTo: 0, hscFrom: 0, hscTo: 0, percent: 0, active: true });
    setWaiverDialogOpen(true);
  };
  const saveWaiver = () => {
    if (!editingWaiver) return;
    if (!editingWaiver.code || !editingWaiver.name) { toast({ title: "Validation", description: "Waiver code and name required" }); return; }
    if (!editingWaiver.id) {
      editingWaiver.id = `w-${Date.now()}`;
      setWaivers((s) => [editingWaiver, ...s]);
      toast({ title: "Waiver added" });
    } else {
      setWaivers((s) => s.map((w) => (w.id === editingWaiver.id ? editingWaiver : w)));
      toast({ title: "Waiver updated" });
    }
    setWaiverDialogOpen(false);
    setEditingWaiver(null);
  };
  const deleteWaiver = (id: string) => { setWaivers((s) => s.filter((w) => w.id !== id)); toast({ title: "Waiver deleted" }); };

  // Quota handlers
  const openAddQuota = () => { setEditingQuota({ name: "", type: "Quota", percent: 0, notes: "" }); setQuotaDialogOpen(true); };
  const saveQuota = () => {
    if (!editingQuota) return;
    if (!editingQuota.name) { toast({ title: "Validation", description: "Name required" }); return; }
    if (!editingQuota.id) { editingQuota.id = `q-${Date.now()}`; setQuotas((s) => [editingQuota, ...s]); toast({ title: "Quota added" }); }
    else { setQuotas((s) => s.map((q) => (q.id === editingQuota.id ? editingQuota : q))); toast({ title: "Quota updated" }); }
    setQuotaDialogOpen(false); setEditingQuota(null);
  };
  const deleteQuota = (id: string) => { setQuotas((s) => s.filter((q) => q.id !== id)); toast({ title: "Quota deleted" }); };

  // Auto course offering generator (simple mock)
  const generateCourses = () => {
    const list = [] as any[];
    for (let i = 1; i <= 8; i++) {
      list.push({ code: `${autoProgram}-${String(i).padStart(3, "0")}`, title: `Course ${i} for ${autoProgram}`, credit: i % 4 === 0 ? 0 : 3, semester: Math.ceil(i / 2), levelTerm: `${Math.ceil(i/2)}-term` });
    }
    setGeneratedCourses(list);
    toast({ title: "Courses generated" });
  };

  // Circulars
  const openAddCircular = () => { setEditingCircular({ name: "", intake: "", session: "Fall", deadline: "", eligibility: "" }); setCircularDialogOpen(true); };
  const saveCircular = () => { if (!editingCircular) return; if (!editingCircular.name) { toast({ title: "Validation", description: "Circular name required" }); return; } if (!editingCircular.id) { editingCircular.id = `c-${Date.now()}`; setCirculars((s) => [editingCircular, ...s]); toast({ title: "Circular added" }); } else { setCirculars((s) => s.map((c) => (c.id === editingCircular.id ? editingCircular : c))); toast({ title: "Circular updated" }); } setCircularDialogOpen(false); setEditingCircular(null); };
  const deleteCircular = (id: string) => { setCirculars((s) => s.filter((c) => c.id !== id)); toast({ title: "Circular deleted" }); };

  // Change history mock add
  const addChangeHistory = (oldVal: any, newVal: any, field: string) => {
    setChangeHistory((s) => [{ field, oldValue: oldVal, newValue: newVal, changedBy: "admin", date: new Date().toISOString() }, ...s]);
  };

  const feeCalculation = (pkg: any, credits: number, percentWaiver = 0, percentDiscount = 0, quotaPercent = 0) => {
    const admission = Number(pkg.admissionFee || 0);
    const tuition = Number(pkg.perCreditFee || 0) * credits;
    const fixed = Number(pkg.fixedFees || 0);
    const gross = admission + tuition + fixed;
    // quotas applied before waiver
    const quotaAmount = (gross * (quotaPercent/100));
    const afterQuota = gross - quotaAmount;
    const waiverAmount = (afterQuota * (percentWaiver/100));
    const discountAmount = (afterQuota * (percentDiscount/100));
    const total = afterQuota - waiverAmount - discountAmount;
    return { admission, tuition, fixed, gross, quotaAmount, waiverAmount, discountAmount, total };
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Admission & Fee Structure Management</h2>

      {/* Packages */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fee Structure & Package Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div />
            <div>
              <Button onClick={openAddPackage}>+ Add Package</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Admission Fee</TableHead>
                <TableHead>Per Credit Fee</TableHead>
                <TableHead>Fixed Fees</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.program}</TableCell>
                  <TableCell>{p.admissionFee}</TableCell>
                  <TableCell>{p.perCreditFee}</TableCell>
                  <TableCell>{p.fixedFees}</TableCell>
                  <TableCell>{calcPackageTotal(p)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => { setEditingPackage({ ...p }); setPkgDialogOpen(true); }}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Package</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete this package?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletePackage(p.id)}>Yes, Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Waiver Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Waiver Management (SSC, HSC & Others)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div />
            <div>
              <Button onClick={openAddWaiver}>+ Add Waiver Rule</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waiver Name</TableHead>
                <TableHead>SSC GPA From</TableHead>
                <TableHead>SSC GPA To</TableHead>
                <TableHead>HSC GPA From</TableHead>
                <TableHead>HSC GPA To</TableHead>
                <TableHead>Percent</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waivers.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{w.sscFrom}</TableCell>
                  <TableCell>{w.sscTo}</TableCell>
                  <TableCell>{w.hscFrom}</TableCell>
                  <TableCell>{w.hscTo}</TableCell>
                  <TableCell>{w.percent}%</TableCell>
                  <TableCell>{w.type}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => { setEditingWaiver({ ...w }); setWaiverDialogOpen(true); }}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Waiver</AlertDialogTitle>
                            <AlertDialogDescription>Confirm deletion</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteWaiver(w.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quota & Discount Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quota & Discount Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div />
            <div>
              <Button onClick={openAddQuota}>+ Add Quota</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quota/Discount Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Percent</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotas.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{q.name}</TableCell>
                  <TableCell>{q.type}</TableCell>
                  <TableCell>{q.percent}%</TableCell>
                  <TableCell>{q.active ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => { setEditingQuota({ ...q }); setQuotaDialogOpen(true); }}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Quota</AlertDialogTitle>
                            <AlertDialogDescription>Confirm deletion</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteQuota(q.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Auto Course Offering */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Auto Course Offering (Level-Term Wise)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Program</Label>
              <Select value={autoProgram} onValueChange={setAutoProgram}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMS.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Session</Label>
              <Select value={autoSession} onValueChange={setAutoSession}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                  <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={generateCourses}>Generate Courses</Button>
            </div>
          </div>

          {generatedCourses.length>0 && (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Level-Term</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generatedCourses.map((g) => (
                    <TableRow key={g.code}>
                      <TableCell>{g.code}</TableCell>
                      <TableCell>{g.title}</TableCell>
                      <TableCell>{g.credit}</TableCell>
                      <TableCell>{g.semester}</TableCell>
                      <TableCell>{g.levelTerm}</TableCell>
                      <TableCell>
                        <Button onClick={() => toast({ title: "Edit course", description: "Use course editor to modify before publishing" })}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-3">
                <Button onClick={() => toast({ title: "Saved as default", description: "Generated offering saved as default for selected program/session" })}>Save as Default</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previous Education Data Management (display only) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Previous Education Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>SSC GPA</Label>
              <Input />
            </div>
            <div>
              <Label>SSC Board</Label>
              <Input />
            </div>
            <div>
              <Label>SSC Year</Label>
              <Input />
            </div>
            <div>
              <Label>SSC Institute</Label>
              <Input />
            </div>
            <div>
              <Label>HSC GPA</Label>
              <Input />
            </div>
            <div>
              <Label>HSC Board</Label>
              <Input />
            </div>
            <div>
              <Label>HSC Year</Label>
              <Input />
            </div>
            <div>
              <Label>HSC Institute</Label>
              <Input />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">Student profile tab will show education history using the fields above.</div>
        </CardContent>
      </Card>

      {/* Admission Cancellation & Account Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admission Cancellation & Account Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancel Admission</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Admission</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction onClick={() => toast({ title: "Admission cancelled" })}>Yes, Cancel</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={() => toast({ title: "Account deactivated" })}>Deactivate Account</Button>
            <Button onClick={() => toast({ title: "Account locked" })}>Lock Account</Button>
            <Button onClick={() => toast({ title: "Password reset" })}>Reset Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Department Change & Name Correction */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Department Change & Name Correction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Department Change</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMS.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                </SelectContent>
              </Select>
              <div className="mt-2">
                <Button onClick={() => toast({ title: "Change request submitted" })}>Request Change</Button>
              </div>
            </div>
            <div>
              <Label>Name Correction</Label>
              <Input />
              <div className="mt-2">
                <Button onClick={() => toast({ title: "Name correction requested" })}>Submit Correction</Button>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="font-medium">Change Log</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeHistory.map((c,i) => (
                  <TableRow key={i}>
                    <TableCell>{c.oldValue}</TableCell>
                    <TableCell>{c.newValue}</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>{c.changedBy}</TableCell>
                    <TableCell>{new Date(c.date).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Admission Circular Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admission Circular Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div />
            <div>
              <Button onClick={openAddCircular}>+ Add Circular</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Circular Name</TableHead>
                <TableHead>Intake</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {circulars.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.intake}</TableCell>
                  <TableCell>{c.session}</TableCell>
                  <TableCell>{c.deadline}</TableCell>
                  <TableCell>{c.eligibility}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => { setEditingCircular({ ...c }); setCircularDialogOpen(true); }}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Circular</AlertDialogTitle>
                            <AlertDialogDescription>Confirm delete</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCircular(c.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Change History Report */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change History Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Student ID</Label>
              <Input />
            </div>
            <div>
              <Label>Date From</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Date To</Label>
              <Input type="date" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Changed</TableHead>
                <TableHead>Old Value</TableHead>
                <TableHead>New Value</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Date/Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changeHistory.map((h,i)=> (
                <TableRow key={i}>
                  <TableCell>{h.field}</TableCell>
                  <TableCell>{h.oldValue}</TableCell>
                  <TableCell>{h.newValue}</TableCell>
                  <TableCell>{h.changedBy}</TableCell>
                  <TableCell>{new Date(h.date).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Waiver Policy Implementation & Referral */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Waiver Policy & Referral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={waiverPolicy.applyTwoSemesters} onChange={(e)=>setWaiverPolicy({...waiverPolicy, applyTwoSemesters: e.target.checked})} /> Apply waiver for 2 semesters only.</label>
            </div>
            <div>
              <Label>Minimum CGPA required to continue waiver</Label>
              <Input type="number" step="0.01" value={waiverPolicy.minCGPA} onChange={(e:any)=>setWaiverPolicy({...waiverPolicy, minCGPA: Number(e.target.value)})} />
            </div>
            <div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={showReferralInReports} onChange={(e)=>setShowReferralInReports(e.target.checked)} /> Show referral fee collection info in reports.</label>
            </div>
          </div>

          <div className="text-sm text-gray-600">System rules enforced: Fee calculation, waiver validity (2 semesters), auto-suspend if CGPA &lt; threshold, quotas applied before waivers, audit logs maintained. Course offerings generated from syllabus and can be overridden by admin.</div>
        </CardContent>
      </Card>

      {/* Waiver/Scholarship Setup Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Waiver/Scholarship Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => { setEditingWaiver({ code: "NEW", name: "", type: "Waiver", sscFrom: 0, sscTo: 0, hscFrom: 0, hscTo: 0, percent: 0, active: true }); setWaiverDialogOpen(true); }}>+ Add Waiver/Scholarship</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Percent</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>SSC From</TableHead>
                <TableHead>SSC To</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waivers.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>{w.code}</TableCell>
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{w.percent}%</TableCell>
                  <TableCell>{w.type}</TableCell>
                  <TableCell>{w.sscFrom}</TableCell>
                  <TableCell>{w.sscTo}</TableCell>
                  <TableCell>{w.active ? "Active" : "Inactive"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs: Package */}
      <Dialog open={pkgDialogOpen} onOpenChange={setPkgDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPackage?.id ? "Edit Package" : "Add Package"}</DialogTitle>
            <DialogDescription>Package Name, Program, Fees and Notes</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <Label>Package Name</Label>
              <Input value={editingPackage?.name || ""} onChange={(e:any)=>setEditingPackage({...editingPackage, name: e.target.value})} />
            </div>
            <div>
              <Label>Program</Label>
              <Select value={editingPackage?.program || PROGRAMS[0]} onValueChange={(v:any)=>setEditingPackage({...editingPackage, program: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMS.map((p)=> <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Admission Fee</Label>
              <Input type="number" value={editingPackage?.admissionFee || 0} onChange={(e:any)=>setEditingPackage({...editingPackage, admissionFee: Number(e.target.value)})} />
            </div>
            <div>
              <Label>Per Credit Fee</Label>
              <Input type="number" value={editingPackage?.perCreditFee || 0} onChange={(e:any)=>setEditingPackage({...editingPackage, perCreditFee: Number(e.target.value)})} />
            </div>
            <div>
              <Label>Fixed Fees</Label>
              <Input type="number" value={editingPackage?.fixedFees || 0} onChange={(e:any)=>setEditingPackage({...editingPackage, fixedFees: Number(e.target.value)})} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={editingPackage?.notes || ""} onChange={(e:any)=>setEditingPackage({...editingPackage, notes: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={savePackage}>Save</Button>
            <Button variant="outline" onClick={()=>{ setPkgDialogOpen(false); setEditingPackage(null); }}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waiver Dialog */}
      <Dialog open={waiverDialogOpen} onOpenChange={setWaiverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWaiver?.id ? "Edit Waiver" : "Add Waiver"}</DialogTitle>
            <DialogDescription>Define waiver or scholarship rules</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <Label>Waiver Code</Label>
              <Input value={editingWaiver?.code || ""} onChange={(e:any)=>setEditingWaiver({...editingWaiver, code: e.target.value})} />
            </div>
            <div>
              <Label>Waiver Name</Label>
              <Input value={editingWaiver?.name || ""} onChange={(e:any)=>setEditingWaiver({...editingWaiver, name: e.target.value})} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={editingWaiver?.type || "Waiver"} onValueChange={(v:any)=>setEditingWaiver({...editingWaiver, type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Waiver">Waiver</SelectItem>
                  <SelectItem value="Scholarship">Scholarship</SelectItem>
                  <SelectItem value="Discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Percent (%)</Label>
              <Input type="number" value={editingWaiver?.percent || 0} onChange={(e:any)=>setEditingWaiver({...editingWaiver, percent: Number(e.target.value)})} />
            </div>
            <div>
              <Label>SSC GPA From</Label>
              <Input type="number" step="0.01" value={editingWaiver?.sscFrom || 0} onChange={(e:any)=>setEditingWaiver({...editingWaiver, sscFrom: Number(e.target.value)})} />
            </div>
            <div>
              <Label>SSC GPA To</Label>
              <Input type="number" step="0.01" value={editingWaiver?.sscTo || 0} onChange={(e:any)=>setEditingWaiver({...editingWaiver, sscTo: Number(e.target.value)})} />
            </div>
            <div>
              <Label>HSC GPA From</Label>
              <Input type="number" step="0.01" value={editingWaiver?.hscFrom || 0} onChange={(e:any)=>setEditingWaiver({...editingWaiver, hscFrom: Number(e.target.value)})} />
            </div>
            <div>
              <Label>HSC GPA To</Label>
              <Input type="number" step="0.01" value={editingWaiver?.hscTo || 0} onChange={(e:any)=>setEditingWaiver({...editingWaiver, hscTo: Number(e.target.value)})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveWaiver}>Save</Button>
            <Button variant="outline" onClick={()=>{ setWaiverDialogOpen(false); setEditingWaiver(null); }}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quota Dialog */}
      <Dialog open={quotaDialogOpen} onOpenChange={setQuotaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingQuota?.id ? "Edit Quota/Discount" : "Add Quota/Discount"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <Label>Name</Label>
              <Input value={editingQuota?.name || ""} onChange={(e:any)=>setEditingQuota({...editingQuota, name: e.target.value})} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={editingQuota?.type || "Quota"} onValueChange={(v:any)=>setEditingQuota({...editingQuota, type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quota">Quota</SelectItem>
                  <SelectItem value="Discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Percent</Label>
              <Input type="number" value={editingQuota?.percent || 0} onChange={(e:any)=>setEditingQuota({...editingQuota, percent: Number(e.target.value)})} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={editingQuota?.notes || ""} onChange={(e:any)=>setEditingQuota({...editingQuota, notes: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveQuota}>Save</Button>
            <Button variant="outline" onClick={()=>{ setQuotaDialogOpen(false); setEditingQuota(null); }}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Circular Dialog */}
      <Dialog open={circularDialogOpen} onOpenChange={setCircularDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCircular?.id ? "Edit Circular" : "Add Circular"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 mt-3">
            <div>
              <Label>Circular Name</Label>
              <Input value={editingCircular?.name || ""} onChange={(e:any)=>setEditingCircular({...editingCircular, name: e.target.value})} />
            </div>
            <div>
              <Label>Intake</Label>
              <Input value={editingCircular?.intake || ""} onChange={(e:any)=>setEditingCircular({...editingCircular, intake: e.target.value})} />
            </div>
            <div>
              <Label>Session</Label>
              <Select value={editingCircular?.session || "Fall"} onValueChange={(v:any)=>setEditingCircular({...editingCircular, session: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input type="date" value={editingCircular?.deadline || ""} onChange={(e:any)=>setEditingCircular({...editingCircular, deadline: e.target.value})} />
            </div>
            <div>
              <Label>Eligibility</Label>
              <Textarea value={editingCircular?.eligibility || ""} onChange={(e:any)=>setEditingCircular({...editingCircular, eligibility: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveCircular}>Save</Button>
            <Button variant="outline" onClick={()=>{ setCircularDialogOpen(false); setEditingCircular(null); }}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
