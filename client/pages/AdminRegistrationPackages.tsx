import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import apiClient from "../lib/api";
import { useToast } from "../hooks/use-toast";

export default function AdminRegistrationPackages() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [termFilter, setTermFilter] = useState<string | null>(null);
  const [modeFilter, setModeFilter] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getRegistrationPackages();
      if (res.success && res.data)
        setPackages(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to load registration packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = packages.filter((p) => {
    if (search && !`${p.program}`.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (termFilter && p.term !== termFilter) return false;
    if (modeFilter && p.mode !== modeFilter) return false;
    return true;
  });

  const terms = Array.from(new Set(packages.map((p) => p.term))).sort();
  const modes = Array.from(new Set(packages.map((p) => p.mode))).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-plum">
          Registration Packages
        </h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by program name"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
          <Button variant="outline" onClick={() => load()}>
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Packages ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <select
              value={termFilter ?? ""}
              onChange={(e) => setTermFilter(e.target.value || null)}
              className="border rounded p-2"
            >
              <option value="">All Terms</option>
              {terms.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={modeFilter ?? ""}
              onChange={(e) => setModeFilter(e.target.value || null)}
              className="border rounded p-2"
            >
              <option value="">All Modes</option>
              {modes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Admission Fee</TableHead>
                <TableHead>Per Credit</TableHead>
                <TableHead>Fixed Fees</TableHead>
                <TableHead>Total (Est)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.program}</TableCell>
                  <TableCell>{p.term}</TableCell>
                  <TableCell>{p.mode}</TableCell>
                  <TableCell>{p.credits}</TableCell>
                  <TableCell>৳{p.admissionFee.toLocaleString()}</TableCell>
                  <TableCell>৳{p.perCredit.toLocaleString()}</TableCell>
                  <TableCell>৳{p.fixedFees.toLocaleString()}</TableCell>
                  <TableCell>৳{p.totalEstimated.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => {
                        updatePackageSelection(p);
                      }}
                    >
                      Use
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  function updatePackageSelection(pkg: any) {
    // Pre-fill application draft via localStorage to keep consistent with ApplicationContext
    try {
      const draft = JSON.parse(
        localStorage.getItem("nu_application_draft") || "{}",
      );
      const updated = {
        ...draft,
        program: pkg.id,
        totalCost: pkg.totalEstimated,
      };
      localStorage.setItem("nu_application_draft", JSON.stringify(updated));
      toast({
        title: "Package applied",
        description: `${pkg.program} applied to draft.`,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to apply package",
        variant: "destructive",
      });
    }
  }
}
