import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ImportJob {
  import_job_id: number;
  file_name: string | null;
  idempotency_key: string | null;
  status: string;
  total_rows: number;
  success_rows: number;
  failed_rows: number;
  created_at: string;
}

export default function AdminImportJobs() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedJobErrors, setSelectedJobErrors] = useState<any[] | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const fetchJobs = async (p = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admissions/imports?page=${p}&limit=20`, { headers: { 'Content-Type': 'application/json' } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setJobs(json.data.jobs || []);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load import jobs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(page); }, [page]);

  const viewErrors = async (jobId: number) => {
    try {
      const res = await fetch(`/api/admissions/imports/${jobId}/errors`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load errors');
      setSelectedJobErrors(json.data || []);
      setErrorDialogOpen(true);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load errors', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-deep-plum">Import Jobs</h1>
        <div className="text-sm text-gray-600">Manage bulk application imports and view row errors</div>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Recent Import Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((j) => (
                <TableRow key={j.import_job_id}>
                  <TableCell className="font-medium">{j.import_job_id}</TableCell>
                  <TableCell>{j.file_name || '-'}</TableCell>
                  <TableCell>{j.status}</TableCell>
                  <TableCell>{j.total_rows}</TableCell>
                  <TableCell>{j.success_rows}</TableCell>
                  <TableCell>{j.failed_rows}</TableCell>
                  <TableCell>{new Date(j.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => viewErrors(j.import_job_id)}>View Errors</Button>
                      <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(String(j.import_job_id)); toast({ title: 'Copied', description: 'Import job id copied' }); }}>Copy ID</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Page {page}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Errors</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            {!selectedJobErrors || selectedJobErrors.length === 0 ? (
              <p className="text-sm text-gray-500">No errors found</p>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="p-2">Row</th>
                    <th className="p-2">Column</th>
                    <th className="p-2">Code</th>
                    <th className="p-2">Message</th>
                    <th className="p-2">Raw Row</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJobErrors.map((e, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2 align-top">{e.row_number}</td>
                      <td className="p-2 align-top">{e.column_name}</td>
                      <td className="p-2 align-top">{e.error_code}</td>
                      <td className="p-2 align-top">{e.error_message}</td>
                      <td className="p-2 align-top"><pre className="text-xs max-w-xl overflow-auto">{e.raw_row_json}</pre></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
