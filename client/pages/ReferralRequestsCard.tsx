import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import apiClient from "../lib/api";
import { useToast } from "../hooks/use-toast";

export default function ReferralRequestsCard() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<number | null>(null);
  const [selectedPercent, setSelectedPercent] = useState<
    Record<number, number>
  >({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getReferralRequests();
      if (res.success && Array.isArray(res.data)) setRequests(res.data);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to load referral requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (app: any) => {
    const percentage = selectedPercent[app.application_id] ?? 5;
    setApproving(app.application_id);
    try {
      const res = await apiClient.approveReferralRequest(
        app.application_id,
        Number(percentage),
      );
      if (res.success) {
        toast({
          title: "Approved",
          description: `Approved ${percentage}% for ${app.first_name} ${app.last_name}`,
        });
        load();
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to approve",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to approve referral",
        variant: "destructive",
      });
    } finally {
      setApproving(null);
    }
  };

  const presets = [5, 10, 15, 20];

  if (!requests || requests.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Referral Requests ({requests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Referrer</TableHead>
              <TableHead>Final Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r: any) => (
              <TableRow key={r.application_id}>
                <TableCell>
                  {r.first_name} {r.last_name}
                </TableCell>
                <TableCell>{r.tracking_id || r.uuid}</TableCell>
                <TableCell>
                  {r.referrer_name || r.referrer_employee_id}
                </TableCell>
                <TableCell>{r.final_amount ?? r.total_cost}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded p-1"
                      value={selectedPercent[r.application_id] ?? 5}
                      onChange={(e) =>
                        setSelectedPercent((prev) => ({
                          ...prev,
                          [r.application_id]: Number(e.target.value),
                        }))
                      }
                    >
                      {presets.map((p) => (
                        <option key={p} value={p}>
                          {p}%
                        </option>
                      ))}
                      <option value={0}>Custom</option>
                    </select>
                    <Button
                      onClick={() => approve(r)}
                      disabled={approving === r.application_id}
                      className="bg-deep-plum text-white"
                    >
                      {approving === r.application_id
                        ? "Approving..."
                        : "Approve"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
