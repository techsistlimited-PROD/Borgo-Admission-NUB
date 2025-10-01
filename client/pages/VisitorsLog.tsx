import React, { useEffect, useState } from "react";
import { Download, Plus, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../hooks/use-toast";
import apiClient from "../lib/api";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

export default function VisitorsLog() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);

  const [editing, setEditing] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [form, setForm] = useState<any>({
    visit_date: new Date().toISOString().slice(0,10),
    campus: "Main Campus",
    visitor_name: "",
    district: "",
    no_of_visitors: 1,
    contact_number: "",
    interested_in: "",
    sms_sent: false,
    remarks: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getVisitors({ page, limit, search, dateFrom, dateTo });
      if (res.success && res.data) {
        setVisitors(res.data.visitors || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load visitors", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const handleExport = async () => {
    try {
      const res = await apiClient.exportVisitors({ dateFrom, dateTo, search });
      if (res.success && res.data) {
        const rows = res.data;
        if (!rows || rows.length === 0) { toast({ title: "No data" }); return; }
        const keys = Object.keys(rows[0]);
        const lines = [keys.join(",")];
        for (const r of rows) lines.push(keys.map(k => '"'+(r[k] ?? "")+'"').join(","));
        const blob = new Blob([lines.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "visitors.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        toast({ title: "Exported", description: "CSV generated" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to export", variant: "destructive" });
    }
  };

  const openNew = () => { setEditing(null); setForm({ visit_date: new Date().toISOString().slice(0,10), campus: "Main Campus", visitor_name: "", district: "", no_of_visitors: 1, contact_number: "", interested_in: "", sms_sent: false, remarks: "" }); setDialogOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) {
        const res = await apiClient.updateVisitor(editing.id, form);
        if (res.success) {
          toast({ title: "Updated" }); setDialogOpen(false); load();
        }
      } else {
        const res = await apiClient.createVisitor(form);
        if (res.success) { toast({ title: "Created" }); setDialogOpen(false); load(); }
      }
    } catch (err) { console.error(err); toast({ title: "Error", description: "Failed to save", variant: "destructive" }); }
  };

  const handleEdit = (v: any) => { setEditing(v); setForm({ ...v }); setDialogOpen(true); };
  const handleDelete = async (id: string) => { if (!confirm("Delete visitor?")) return; const res = await apiClient.deleteVisitor(id); if (res.success) { toast({ title: "Deleted" }); load(); } else toast({ title: "Error", description: res.error, variant: "destructive" }); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-plum">Visitors Log</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2"/>Export</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-deep-plum"><Plus className="w-4 h-4 mr-2"/>Add Visitor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Visitor" : "New Visitor"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Visit Date</Label>
                  <Input type="date" value={form.visit_date} onChange={(e:any)=>setForm({...form, visit_date: e.target.value})} />
                </div>
                <div>
                  <Label>Campus</Label>
                  <Input value={form.campus} onChange={(e:any)=>setForm({...form, campus: e.target.value})} />
                </div>
                <div>
                  <Label>Visitor Name</Label>
                  <Input value={form.visitor_name} onChange={(e:any)=>setForm({...form, visitor_name: e.target.value})} />
                </div>
                <div>
                  <Label>District</Label>
                  <Input value={form.district} onChange={(e:any)=>setForm({...form, district: e.target.value})} />
                </div>
                <div>
                  <Label>No. of Visitors</Label>
                  <Input type="number" value={form.no_of_visitors} onChange={(e:any)=>setForm({...form, no_of_visitors: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <Input value={form.contact_number} onChange={(e:any)=>setForm({...form, contact_number: e.target.value})} />
                </div>
                <div>
                  <Label>Interested In (Program Code)</Label>
                  <Input value={form.interested_in} onChange={(e:any)=>setForm({...form, interested_in: e.target.value})} />
                </div>
                <div>
                  <Label>Remarks</Label>
                  <Textarea value={form.remarks} onChange={(e:any)=>setForm({...form, remarks: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={()=>setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitors ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <Input placeholder="Search by name, phone, district" value={search} onChange={(e:any)=>setSearch(e.target.value)} />
            <Input type="date" value={dateFrom||""} onChange={(e:any)=>setDateFrom(e.target.value||undefined)} />
            <Input type="date" value={dateTo||""} onChange={(e:any)=>setDateTo(e.target.value||undefined)} />
            <Button variant="outline" onClick={()=>{ setPage(1); load(); }}>Filter</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Campus</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>District</TableHead>
                <TableHead>No.</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Interested In</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.id}</TableCell>
                  <TableCell>{v.visit_date}</TableCell>
                  <TableCell>{v.campus}</TableCell>
                  <TableCell>{v.visitor_name}</TableCell>
                  <TableCell>{v.district}</TableCell>
                  <TableCell>{v.no_of_visitors}</TableCell>
                  <TableCell>{v.contact_number}</TableCell>
                  <TableCell>{v.interested_in}</TableCell>
                  <TableCell>{v.remarks}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={()=>handleEdit(v)}><Edit2 className="w-4 h-4"/></Button>
                      <Button variant="ghost" size="sm" onClick={()=>handleDelete(v.id)}><Trash2 className="w-4 h-4 text-red-600"/></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">Showing {visitors.length} of {total}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</Button>
              <div className="px-3 py-2 border rounded">{page}</div>
              <Button variant="outline" onClick={()=>setPage((p)=>p+1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
