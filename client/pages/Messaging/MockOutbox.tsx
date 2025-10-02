import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import apiClient from "../../lib/api";
import { Copy, Mail, Trash } from "lucide-react";

export default function MockOutbox() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getMockEmails();
      if (res.success && Array.isArray(res.data)) setEmails(res.data);
    } catch (e) {
      console.error("Failed to load mock emails", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const copyBody = (body: string) => {
    navigator.clipboard.writeText(body || "");
  };

  const filtered = emails.filter((e) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return [e.to_address, e.subject, e.body, String(e.application_id)].filter(Boolean).join(" ").toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5" /> Mock Email Outbox
          </h2>
          <div>
            <Button onClick={load} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sent Mock Emails</CardTitle>
          </CardHeader>
          <CardContent>
            {emails.length === 0 ? (
              <div className="text-sm text-gray-500">No mock emails found.</div>
            ) : (
              <div className="space-y-3">
                {emails.map((e) => (
                  <div key={e.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-600">To: {e.to_address || "-"}</div>
                        <div className="font-semibold">{e.subject || "(no subject)"}</div>
                        <div className="text-xs text-gray-500">Application: {e.application_id || "-"} — {new Date(e.created_at).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => copyBody(e.body)}>
                          <Copy className="w-4 h-4 mr-1" /> Copy Body
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm whitespace-pre-wrap text-gray-700">{e.body}</div>
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
