import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminKpiCache() {
  const { toast } = useToast();
  const [semester, setSemester] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCache = async () => {
    try {
      if (!semester) return toast({ title: 'Provide semester_id', variant: 'destructive' });
      setLoading(true);
      const res = await fetch(`/api/admissions/kpi/cache?semester_id=${encodeURIComponent(semester)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setRows(json.data || []);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Unable to load KPI cache', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-deep-plum">KPI Cache</h1>
        <p className="text-sm text-gray-600">View recent KPI cache entries</p>
      </div>

      <Card className="bg-white mb-6">
        <CardContent>
          <div className="flex gap-2 items-center">
            <Input placeholder="Semester ID" value={semester} onChange={(e) => setSemester(e.target.value)} />
            <Button onClick={fetchCache} disabled={loading}>{loading ? 'Loading...' : 'Load Cache'}</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Cache Entries ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-gray-500">No cache entries. Try loading a semester.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="p-2">Metric</th>
                    <th className="p-2">Value</th>
                    <th className="p-2">Program</th>
                    <th className="p-2">Campus</th>
                    <th className="p-2">From</th>
                    <th className="p-2">To</th>
                    <th className="p-2">Generated At</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 align-top">{r.metric_key}</td>
                      <td className="p-2 align-top">{r.metric_value}</td>
                      <td className="p-2 align-top">{r.program_id || '-'}</td>
                      <td className="p-2 align-top">{r.campus_id || '-'}</td>
                      <td className="p-2 align-top">{r.date_from || '-'}</td>
                      <td className="p-2 align-top">{r.date_to || '-'}</td>
                      <td className="p-2 align-top">{new Date(r.generated_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
