import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Bell,
  Shield,
  CreditCard,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useToast } from "../hooks/use-toast";
import apiClient from "../lib/api";

// @ts-nocheck - Temporarily disable type checking for this component

interface AdmissionSettings {
  application_start_date: string;
  application_deadline: string;
  late_fee_deadline: string;
  session_name: string;
  admission_fee: number;
  late_fee: number;
  max_waiver_percentage: number;
  is_admission_open: boolean;
  allow_application_editing: boolean;
  waiver_enabled: boolean;
  auto_approve_applications: boolean;
  require_payment_for_review: boolean;
  enable_sms_notifications: boolean;
  enable_email_notifications: boolean;
  contact_email: string;
  contact_phone: string;
  help_desk_hours: string;
}

interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  enabled: boolean;
  account_number: string;
  instructions: string;
  processing_fee: number;
  minimum_amount: number;
  maximum_amount: number;
  bank_name?: string;
  routing_number?: string;
  is_active?: boolean;
  order_priority?: number;
}

interface DocumentRequirement {
  id: number;
  name: string;
  type: string;
  is_required: boolean;
  allowed_formats: string[];
  max_file_size: string;
  description: string;
  order_priority?: number;
}

export default function AdmissionConfiguration() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AdmissionSettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [documentRequirements, setDocumentRequirements] = useState<DocumentRequirement[]>([]);
  
  // Dialog states
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [editingDocument, setEditingDocument] = useState<DocumentRequirement | null>(null);

  // Form states
  const [paymentForm, setPaymentForm] = useState<Partial<PaymentMethod>>({
    name: "",
    type: "bank",
    account_number: "",
    account_name: "",
    routing_number: "",
    instructions: "",
    is_active: true,
    order_priority: 0,
  });

  const [documentForm, setDocumentForm] = useState<Partial<DocumentRequirement>>({
    name: "",
    description: "",
    is_required: true,
    file_types: "pdf,jpg,jpeg,png",
    max_file_size_mb: 5,
    order_priority: 0,
    is_active: true,
  });

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);

      // Load admission settings
      const settingsResponse = await apiClient.getAdmissionSettings();
      if (settingsResponse.success && settingsResponse.data) {
        setSettings(settingsResponse.data);
      }

      // Load payment methods
      const paymentResponse = await apiClient.getPaymentMethods();
      if (paymentResponse.success && paymentResponse.data) {
        setPaymentMethods(paymentResponse.data);
      }

      // Load document requirements
      const documentResponse = await apiClient.getDocumentRequirements();
      if (documentResponse.success && documentResponse.data) {
        setDocumentRequirements(documentResponse.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load configuration data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save admission settings
  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await apiClient.updateAdmissionSettings(settings);

      if (response.success) {
        toast({
          title: "Success",
          description: "Admission settings saved successfully",
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Payment method handlers
  const openPaymentDialog = (payment?: PaymentMethod) => {
    if (payment) {
      setEditingPayment(payment);
      setPaymentForm(payment);
    } else {
      setEditingPayment(null);
      setPaymentForm({
        name: "",
        type: "bank",
        account_number: "",
        account_name: "",
        routing_number: "",
        instructions: "",
        is_active: true,
        order_priority: paymentMethods.length,
      });
    }
    setPaymentDialogOpen(true);
  };

  const savePaymentMethod = async () => {
    try {
      const response = editingPayment
        ? await apiClient.updatePaymentMethod(editingPayment.id.toString(), paymentForm)
        : await apiClient.createPaymentMethod(paymentForm);

      if (response.success) {
        toast({
          title: "Success",
          description: `Payment method ${editingPayment ? "updated" : "created"} successfully`,
        });
        setPaymentDialogOpen(false);
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive",
      });
    }
  };

  const deletePaymentMethod = async (id: number) => {
    try {
      const response = await apiClient.deletePaymentMethod(id.toString());
      if (response.success) {
        toast({
          title: "Success",
          description: "Payment method deleted successfully",
        });
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive",
      });
    }
  };

  // Document requirement handlers
  const openDocumentDialog = (document?: DocumentRequirement) => {
    if (document) {
      setEditingDocument(document);
      setDocumentForm(document);
    } else {
      setEditingDocument(null);
      setDocumentForm({
        name: "",
        description: "",
        is_required: true,
        file_types: "pdf,jpg,jpeg,png",
        max_file_size_mb: 5,
        order_priority: documentRequirements.length,
        is_active: true,
      });
    }
    setDocumentDialogOpen(true);
  };

  const saveDocumentRequirement = async () => {
    try {
      const response = editingDocument
        ? await apiClient.updateDocumentRequirement(editingDocument.id.toString(), documentForm)
        : await apiClient.createDocumentRequirement(documentForm);

      if (response.success) {
        toast({
          title: "Success",
          description: `Document requirement ${editingDocument ? "updated" : "created"} successfully`,
        });
        setDocumentDialogOpen(false);
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error saving document requirement:", error);
      toast({
        title: "Error",
        description: "Failed to save document requirement",
        variant: "destructive",
      });
    }
  };

  const deleteDocumentRequirement = async (id: number) => {
    try {
      const response = await apiClient.deleteDocumentRequirement(id.toString());

      if (response.success) {
        toast({
          title: "Success",
          description: "Document requirement deleted successfully",
        });
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error deleting document requirement:", error);
      toast({
        title: "Error",
        description: "Failed to delete document requirement",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-deep-plum" />
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load admission settings. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-deep-plum font-poppins flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Admission Configuration
            </h1>
            <p className="text-gray-600 mt-1">
              Manage admission settings, payment methods, and document requirements
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={loadData}
              disabled={loading}
              className="border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General Settings
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Document Requirements
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Admission Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Application Start Date</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={settings.application_start_date?.slice(0, 16) || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      application_start_date: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={settings.application_deadline?.slice(0, 16) || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      application_deadline: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="late_deadline">Late Fee Deadline</Label>
                  <Input
                    id="late_deadline"
                    type="datetime-local"
                    value={settings.late_fee_deadline?.slice(0, 16) || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      late_fee_deadline: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="session_name">Session Name</Label>
                  <Input
                    id="session_name"
                    value={settings.session_name || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      session_name: e.target.value
                    })}
                    placeholder="e.g., Spring 2024"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Fee Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="admission_fee">Admission Fee (৳)</Label>
                  <Input
                    id="admission_fee"
                    type="number"
                    value={settings.admission_fee || 0}
                    onChange={(e) => setSettings({
                      ...settings,
                      admission_fee: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="late_fee">Late Fee (৳)</Label>
                  <Input
                    id="late_fee"
                    type="number"
                    value={settings.late_fee || 0}
                    onChange={(e) => setSettings({
                      ...settings,
                      late_fee: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="max_waiver">Max Waiver (%)</Label>
                  <Input
                    id="max_waiver"
                    type="number"
                    max="100"
                    value={settings.max_waiver_percentage || 0}
                    onChange={(e) => setSettings({
                      ...settings,
                      max_waiver_percentage: Number(e.target.value)
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admission_open">Admission Open</Label>
                    <Switch
                      id="admission_open"
                      checked={settings.is_admission_open}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        is_admission_open: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="editing_allowed">Allow Application Editing</Label>
                    <Switch
                      id="editing_allowed"
                      checked={settings.allow_application_editing}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        allow_application_editing: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="waiver_enabled">Enable Waiver System</Label>
                    <Switch
                      id="waiver_enabled"
                      checked={settings.waiver_enabled}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        waiver_enabled: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto_approve">Auto-approve Applications</Label>
                    <Switch
                      id="auto_approve"
                      checked={settings.auto_approve_applications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        auto_approve_applications: checked
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="phone_verification">Require Phone Verification</Label>
                    <Switch
                      id="phone_verification"
                      checked={settings.require_phone_verification}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        require_phone_verification: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email_verification">Require Email Verification</Label>
                    <Switch
                      id="email_verification"
                      checked={settings.require_email_verification}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        require_email_verification: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="document_upload">Require Document Upload</Label>
                    <Switch
                      id="document_upload"
                      checked={settings.require_document_upload}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        require_document_upload: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms_notifications">SMS Notifications</Label>
                    <Switch
                      id="sms_notifications"
                      checked={settings.send_sms_notifications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        send_sms_notifications: checked
                      })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="max_applications">Max Applications per User</Label>
                <Input
                  id="max_applications"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.max_applications_per_user || 1}
                  onChange={(e) => setSettings({
                    ...settings,
                    max_applications_per_user: Number(e.target.value)
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Content & Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact_email: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact_phone: e.target.value
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="admission_notice">Admission Notice</Label>
                <Textarea
                  id="admission_notice"
                  rows={3}
                  value={settings.admission_notice || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    admission_notice: e.target.value
                  })}
                  placeholder="Welcome message or important notice for applicants..."
                />
              </div>
              <div>
                <Label htmlFor="payment_instructions">Payment Instructions</Label>
                <Textarea
                  id="payment_instructions"
                  rows={3}
                  value={settings.payment_instructions || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    payment_instructions: e.target.value
                  })}
                  placeholder="Instructions for payment process..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={saveSettings} 
              disabled={saving}
              className="bg-deep-plum hover:bg-accent-purple"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Methods</CardTitle>
              <Button onClick={() => openPaymentDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">{method.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{method.type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {method.account_number}
                      </TableCell>
                      <TableCell>
                        <Badge variant={method.is_active ? "default" : "secondary"}>
                          {method.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{method.order_priority}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPaymentDialog(method)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePaymentMethod(method.id!)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Requirements Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Document Requirements</CardTitle>
              <Button onClick={() => openDocumentDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Document Requirement
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>File Types</TableHead>
                    <TableHead>Max Size</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentRequirements.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.description}</TableCell>
                      <TableCell>
                        <Badge variant={doc.is_required ? "destructive" : "secondary"}>
                          {doc.is_required ? "Required" : "Optional"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {doc.file_types}
                      </TableCell>
                      <TableCell>{doc.max_file_size_mb} MB</TableCell>
                      <TableCell>{doc.order_priority}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDocumentDialog(doc)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteDocumentRequirement(doc.id!)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Method Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? "Edit Payment Method" : "Add Payment Method"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment_name">Name</Label>
              <Input
                id="payment_name"
                value={paymentForm.name || ""}
                onChange={(e) => setPaymentForm({
                  ...paymentForm,
                  name: e.target.value
                })}
                placeholder="e.g., Dutch Bangla Bank"
              />
            </div>
            <div>
              <Label htmlFor="payment_type">Type</Label>
              <Select
                value={paymentForm.type}
                onValueChange={(value) => setPaymentForm({
                  ...paymentForm,
                  type: value as "bank" | "mobile" | "online"
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="mobile">Mobile Banking</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                value={paymentForm.account_number || ""}
                onChange={(e) => setPaymentForm({
                  ...paymentForm,
                  account_number: e.target.value
                })}
              />
            </div>
            <div>
              <Label htmlFor="account_name">Account Name</Label>
              <Input
                id="account_name"
                value={paymentForm.account_name || ""}
                onChange={(e) => setPaymentForm({
                  ...paymentForm,
                  account_name: e.target.value
                })}
              />
            </div>
            <div>
              <Label htmlFor="routing_number">Routing Number (Optional)</Label>
              <Input
                id="routing_number"
                value={paymentForm.routing_number || ""}
                onChange={(e) => setPaymentForm({
                  ...paymentForm,
                  routing_number: e.target.value
                })}
              />
            </div>
            <div>
              <Label htmlFor="payment_instructions">Instructions</Label>
              <Textarea
                id="payment_instructions"
                value={paymentForm.instructions || ""}
                onChange={(e) => setPaymentForm({
                  ...paymentForm,
                  instructions: e.target.value
                })}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="payment_active">Active</Label>
              <Switch
                id="payment_active"
                checked={paymentForm.is_active}
                onCheckedChange={(checked) => setPaymentForm({
                  ...paymentForm,
                  is_active: checked
                })}
              />
            </div>
            <div>
              <Label htmlFor="payment_priority">Display Priority</Label>
              <Input
                id="payment_priority"
                type="number"
                value={paymentForm.order_priority || 0}
                onChange={(e) => setPaymentForm({
                  ...paymentForm,
                  order_priority: Number(e.target.value)
                })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={savePaymentMethod}>
                {editingPayment ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Requirement Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDocument ? "Edit Document Requirement" : "Add Document Requirement"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="doc_name">Name</Label>
              <Input
                id="doc_name"
                value={documentForm.name || ""}
                onChange={(e) => setDocumentForm({
                  ...documentForm,
                  name: e.target.value
                })}
                placeholder="e.g., SSC Certificate"
              />
            </div>
            <div>
              <Label htmlFor="doc_description">Description</Label>
              <Textarea
                id="doc_description"
                value={documentForm.description || ""}
                onChange={(e) => setDocumentForm({
                  ...documentForm,
                  description: e.target.value
                })}
                rows={2}
                placeholder="Brief description of the document requirement"
              />
            </div>
            <div>
              <Label htmlFor="file_types">Allowed File Types</Label>
              <Input
                id="file_types"
                value={documentForm.file_types || ""}
                onChange={(e) => setDocumentForm({
                  ...documentForm,
                  file_types: e.target.value
                })}
                placeholder="pdf,jpg,jpeg,png"
              />
            </div>
            <div>
              <Label htmlFor="max_size">Max File Size (MB)</Label>
              <Input
                id="max_size"
                type="number"
                value={documentForm.max_file_size_mb || 5}
                onChange={(e) => setDocumentForm({
                  ...documentForm,
                  max_file_size_mb: Number(e.target.value)
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="doc_required">Required</Label>
              <Switch
                id="doc_required"
                checked={documentForm.is_required}
                onCheckedChange={(checked) => setDocumentForm({
                  ...documentForm,
                  is_required: checked
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="doc_active">Active</Label>
              <Switch
                id="doc_active"
                checked={documentForm.is_active}
                onCheckedChange={(checked) => setDocumentForm({
                  ...documentForm,
                  is_active: checked
                })}
              />
            </div>
            <div>
              <Label htmlFor="doc_priority">Display Priority</Label>
              <Input
                id="doc_priority"
                type="number"
                value={documentForm.order_priority || 0}
                onChange={(e) => setDocumentForm({
                  ...documentForm,
                  order_priority: Number(e.target.value)
                })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDocumentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveDocumentRequirement}>
                {editingDocument ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
