import React, { useEffect, useState } from "react";
import apiClient from "../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Download, Mail } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function MockEmails() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getMockEmails();
      if (res.success && res.data) {
        setEmails(res.data);
      } else {
        toast({ title: "Failed to load mock emails", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error loading mock emails", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const downloadEmail = (email: any) => {
    const blob = new Blob([email.body || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock_email_${email.id || Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast({ title: "Email downloaded" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-deep-plum font-poppins">Mock Emails</h1>
        <p className="text-gray-600 mt-1">List of mock outgoing emails generated during development (admin-only)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" /> Mock Emails</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={load} className="bg-deep-plum hover:bg-accent-purple">Refresh</Button>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHead>To</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Application</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emails.map((e: any) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono text-sm">{e.to_address}</TableCell>
                      <TableCell className="text-sm">{e.subject}</TableCell>
                      <TableCell className="text-sm">{e.application_id || "-"}</TableCell>
                      <TableCell className="text-sm">{new Date(e.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button onClick={() => downloadEmail(e)} className="bg-blue-600 hover:bg-blue-700"><Download className="w-4 h-4 mr-2" />Download</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
