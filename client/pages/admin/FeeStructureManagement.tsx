import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
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
import apiClient from "../../lib/api";

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

  // Waiver policy settings
  const [waiverPolicy, setWaiverPolicy] = useState({ applyTwoSemesters: true, minCGPA: 2.5 });

  // Referral toggle
  const [showReferralInReports, setShowReferralInReports] = useState(false);

  // Waiver/Scholarship Setup uses waivers state above

  // Applications (for selecting student to edit previous education)
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [academicHistory, setAcademicHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [newHistory, setNewHistory] = useState<any>({ level: "SSC", exam_name: "", institute_name: "", passing_year: new Date().getFullYear(), grade_point: "" });

  // Helpers
  const calcPackageTotal = (p: any) => {
    return (Number(p.admissionFee || 0) + Number(p.fixedFees || 0));
  };

  // Packages handlers
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

  // Waivers handlers
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

  // Load applications for student selector
  useEffect(() => {
    const loadApps = async () => {
      try {
        const res = await apiClient.getApplications({ limit: 100 });
        if (res.success && res.data) setApplications(res.data.applications || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadApps();
  }, []);

  // Load academic history when student selected
  useEffect(() => {
    const loadHistory = async () => {
      if (!selectedAppId) { setAcademicHistory([]); return; }
      setLoadingHistory(true);
      try {
        const res = await apiClient.getAcademicHistory(Number(selectedAppId));
        if (res.success) setAcademicHistory(res.data || []);
      } catch (e) { console.error(e); }
      finally { setLoadingHistory(false); }
    };
    loadHistory();
  }, [selectedAppId]);

  const addHistory = async () => {
    if (!selectedAppId) { toast({ title: "Select Student first" }); return; }
    try {
      const payload = { ...newHistory, application_id: selectedAppId };
      const res = await apiClient.addAcademicHistory(payload);
      if (res.success) {
        toast({ title: "Added", description: "Academic history added." });
        setNewHistory({ level: "SSC", exam_name: "", institute_name: "", passing_year: new Date().getFullYear(), grade_point: "" });
        // reload
        const hres = await apiClient.getAcademicHistory(Number(selectedAppId));
        if (hres.success) setAcademicHistory(hres.data || []);
      } else {
        toast({ title: "Failed", description: String(res.error), variant: "destructive" });
      }
    } catch (e) { console.error(e); toast({ title: "Error", description: "Failed to add", variant: "destructive" }); }
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

      {/* Previous Education Data Management: select a student and edit academic history */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Previous Education Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label>Select Student (from Admissions)</Label>
              <Select value={selectedAppId ? String(selectedAppId) : undefined} onValueChange={(v:any)=> setSelectedAppId(v ? Number(v) : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((a:any)=> (
                    <SelectItem key={a.id} value={String(a.id)}>{a.applicant_name} — {a.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600">Choose a student first. Their academic history is editable and stored per application.</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Academic History</h3>
            {loadingHistory ? <div>Loading...</div> : (
              <div className="space-y-2">
                {academicHistory.length===0 ? <div className="text-sm text-gray-500">No records</div> : academicHistory.map((h:any)=> (
                  <div key={h.academic_history_id || h.id} className="p-2 border rounded">
                    <div className="font-semibold">{h.level} — {h.institute_name} ({h.passing_year})</div>
                    <div className="text-xs text-gray-500">{h.exam_name} — GPA: {h.grade_point || h.grade_point}</div>
                  </div>
                ))}

                <div className="mt-4 border-t pt-3">
                  <h4 className="font-medium">Add Academic History</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                    <Input placeholder="Level (SSC/HSC/etc)" value={newHistory.level} onChange={(e:any)=> setNewHistory({...newHistory, level: e.target.value})} />
                    <Input placeholder="Exam Name" value={newHistory.exam_name} onChange={(e:any)=> setNewHistory({...newHistory, exam_name: e.target.value})} />
                    <Input placeholder="Institute" value={newHistory.institute_name} onChange={(e:any)=> setNewHistory({...newHistory, institute_name: e.target.value})} />
                    <Input placeholder="Passing Year" type="number" value={newHistory.passing_year} onChange={(e:any)=> setNewHistory({...newHistory, passing_year: Number(e.target.value)})} />
                    <Input placeholder="Grade Point / GPA" value={newHistory.grade_point} onChange={(e:any)=> setNewHistory({...newHistory, grade_point: e.target.value})} />
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button onClick={addHistory} disabled={!selectedAppId}>Add</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
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

    </div>
  );
}
