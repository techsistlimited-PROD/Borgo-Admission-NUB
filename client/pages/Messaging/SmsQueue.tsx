import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import apiClient from "../../lib/api";
import { MessageCircle, Play } from "lucide-react";

export default function SmsQueue() {
  const [sms, setSms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getSmsQueue();
      if (res.success && Array.isArray(res.data)) setSms(res.data);
    } catch (e) {
      console.error("Failed to load sms queue", e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = sms.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return [s.to_number, s.message, s.provider, String(s.status)].filter(Boolean).join(" ").toLowerCase().includes(q);
  });

  useEffect(() => {
    load();
  }, []);

  const processNext = async () => {
    setProcessing(true);
    try {
      const res = await apiClient.processSms(false);
      if (res.success) {
        await load();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const processAll = async () => {
    setProcessing(true);
    try {
      const res = await apiClient.processSms(true);
      if (res.success) {
        await load();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> SMS Queue
          </h2>
          <div className="flex items-center gap-2">
            <Button onClick={load} disabled={loading}>
              Refresh
            </Button>
            <Button onClick={processNext} disabled={processing || sms.length === 0}>
              <Play className="w-4 h-4 mr-1" /> Process Next
            </Button>
            <Button onClick={processAll} disabled={processing || sms.length === 0}>
              <Play className="w-4 h-4 mr-1" /> Process All
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Queued SMS</CardTitle>
          </CardHeader>
          <CardContent>
            {sms.length === 0 ? (
              <div className="text-sm text-gray-500">No SMS in queue.</div>
            ) : (
              <div className="space-y-3">
                {sms.map((s) => (
                  <div key={s.sms_id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-600">To: {s.to_number}</div>
                        <div className="font-semibold">{s.message}</div>
                        <div className="text-xs text-gray-500">Provider: {s.provider || "-"} — {s.status} — {new Date(s.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
