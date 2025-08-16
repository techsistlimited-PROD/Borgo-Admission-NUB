import { useState } from 'react';
import { Eye, Download, User, DollarSign, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export default function FinancePanel() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [assignOfficer, setAssignOfficer] = useState('');
  const [verificationNote, setVerificationNote] = useState('');

  const texts = {
    en: {
      title: 'Admission Finance Panel',
      subtitle: 'Payment Verification and Management',
      applicant: 'Applicant',
      trackingId: 'Tracking ID',
      amount: 'Amount',
      paymentMethod: 'Payment Method',
      transactionId: 'Transaction ID',
      payslipImage: 'Payslip Image',
      uploadedDate: 'Uploaded Date',
      assignedOfficer: 'Assigned Officer',
      action: 'Action',
      verify: 'Verify',
      reject: 'Reject',
      pending: 'Pending',
      verified: 'Verified',
      rejected: 'Rejected',
      viewPayslip: 'View Payslip',
      assignOfficer: 'Assign Officer',
      verifyPayment: 'Verify Payment',
      rejectPayment: 'Reject Payment',
      verificationNote: 'Verification Note',
      selectOfficer: 'Select Officer',
      close: 'Close',
      submit: 'Submit',
      bkash: 'bKash',
      rocket: 'Rocket',
      card: 'Card',
      offline: 'Offline',
      totalPayments: 'Total Payments',
      pendingVerification: 'Pending Verification',
      verifiedToday: 'Verified Today',
      rejectedPayments: 'Rejected Payments',
      filterByMethod: 'Filter by Method',
      filterByStatus: 'Filter by Status',
      allMethods: 'All Methods',
      allStatus: 'All Status',
      searchPlaceholder: 'Search by applicant name or tracking ID...'
    },
    bn: {
      title: 'ভর্তি ফিন্যান্স প্যানেল',
      subtitle: 'পেমেন্ট যাচাইকরণ এবং ব্যবস্থাপনা',
      applicant: 'আবেদনকারী',
      trackingId: 'ট্র্যাকিং আইডি',
      amount: 'পরিমাণ',
      paymentMethod: 'পেমেন্ট পদ্ধতি',
      transactionId: 'লেনদেন আইডি',
      payslipImage: 'পে-স্লিপ ছবি',
      uploadedDate: 'আপলোড তারিখ',
      assignedOfficer: 'নিযুক্ত কর্মকর্তা',
      action: 'কর্ম',
      verify: 'যাচাই',
      reject: 'প্রত্যাখ্যান',
      pending: 'অপেক্ষমাণ',
      verified: 'যাচাইকৃত',
      rejected: 'প্রত্যাখ্যাত',
      viewPayslip: 'পে-স্লিপ দেখুন',
      assignOfficer: 'কর্মকর্তা নিযুক্ত করুন',
      verifyPayment: 'পেমেন্ট যাচাই করুন',
      rejectPayment: 'পেম���ন্ট প্রত্যাখ্যান করুন',
      verificationNote: 'যাচাইকরণ নোট',
      selectOfficer: 'কর্মকর্তা নির্বাচন করুন',
      close: 'বন্ধ করুন',
      submit: 'জমা দিন',
      bkash: 'বিকাশ',
      rocket: 'রকেট',
      card: 'কার্ড',
      offline: 'অফলাইন',
      totalPayments: 'মোট পেমেন্ট',
      pendingVerification: 'যাচাইকরণ অপেক্ষমাণ',
      verifiedToday: 'আজ যাচাইকৃত',
      rejectedPayments: 'প্রত্যাখ্যাত পেমেন্ট',
      filterByMethod: 'পদ্ধতি অনুযায়ী ফিল্টার',
      filterByStatus: 'অবস্থা অনুযায়ী ফিল্টার',
      allMethods: 'সব পদ্ধতি',
      allStatus: 'সব অবস্থা',
      searchPlaceholder: 'আবেদনকারীর নাম বা ট্র্যাকিং আইডি দিয়ে খুঁজুন...'
    }
  };

  const t = texts[language];

  const payments = [
    {
      id: 1,
      applicant: 'Mohammad Rahman',
      trackingId: 'NU2024001234',
      amount: 54750,
      paymentMethod: 'bkash',
      transactionId: 'BKS123456789',
      payslipImage: '/payslip1.jpg',
      uploadedDate: '2024-01-20',
      assignedOfficer: 'Ahmed Hassan',
      status: 'pending'
    },
    {
      id: 2,
      applicant: 'Fatima Ahmed',
      trackingId: 'NU2024001235',
      amount: 73000,
      paymentMethod: 'rocket',
      transactionId: 'RKT987654321',
      payslipImage: '/payslip2.jpg',
      uploadedDate: '2024-01-19',
      assignedOfficer: 'Rashida Khan',
      status: 'verified'
    },
    {
      id: 3,
      applicant: 'Abdul Karim',
      trackingId: 'NU2024001236',
      amount: 73000,
      paymentMethod: 'offline',
      transactionId: 'OFF456789123',
      payslipImage: '/payslip3.jpg',
      uploadedDate: '2024-01-18',
      assignedOfficer: 'Ali Hasan',
      status: 'rejected'
    },
    {
      id: 4,
      applicant: 'Rashida Begum',
      trackingId: 'NU2024001237',
      amount: 54750,
      paymentMethod: 'card',
      transactionId: 'CRD789123456',
      payslipImage: '/payslip4.jpg',
      uploadedDate: '2024-01-17',
      assignedOfficer: null,
      status: 'pending'
    }
  ];

  const officers = [
    'Ahmed Hassan',
    'Rashida Khan', 
    'Ali Hasan',
    'Mahmuda Akter',
    'Karim Ahmed'
  ];

  const summaryStats = [
    { label: t.totalPayments, value: 156, color: 'bg-blue-100 text-blue-800', icon: DollarSign },
    { label: t.pendingVerification, value: 23, color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { label: t.verifiedToday, value: 8, color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { label: t.rejectedPayments, value: 3, color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: t.pending },
      verified: { color: 'bg-green-100 text-green-800', label: t.verified },
      rejected: { color: 'bg-red-100 text-red-800', label: t.rejected }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      bkash: t.bkash,
      rocket: t.rocket,
      card: t.card,
      offline: t.offline
    };
    return methods[method as keyof typeof methods] || method;
  };

  const handleVerifyPayment = (payment: any) => {
    setSelectedPayment(payment);
    // In real app, this would update the payment status
  };

  const handleRejectPayment = (payment: any) => {
    setSelectedPayment(payment);
    // In real app, this would update the payment status
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {t.title}
              </h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-4">
              <Button className="bg-deep-plum hover:bg-accent-purple">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    language === 'en'
                      ? 'bg-deep-plum text-white'
                      : 'text-gray-600 hover:text-deep-plum'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    language === 'bn'
                      ? 'bg-deep-plum text-white'
                      : 'text-gray-600 hover:text-deep-plum'
                  }`}
                >
                  BN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryStats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-deep-plum">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input placeholder={t.searchPlaceholder} />
              </div>
              <div className="md:w-48">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t.filterByMethod} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allMethods}</SelectItem>
                    <SelectItem value="bkash">{t.bkash}</SelectItem>
                    <SelectItem value="rocket">{t.rocket}</SelectItem>
                    <SelectItem value="card">{t.card}</SelectItem>
                    <SelectItem value="offline">{t.offline}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-48">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t.filterByStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allStatus}</SelectItem>
                    <SelectItem value="pending">{t.pending}</SelectItem>
                    <SelectItem value="verified">{t.verified}</SelectItem>
                    <SelectItem value="rejected">{t.rejected}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-poppins text-deep-plum">
              Payment Verification Queue ({payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.applicant}</TableHead>
                  <TableHead>{t.trackingId}</TableHead>
                  <TableHead>{t.amount}</TableHead>
                  <TableHead>{t.paymentMethod}</TableHead>
                  <TableHead>{t.transactionId}</TableHead>
                  <TableHead>{t.payslipImage}</TableHead>
                  <TableHead>{t.uploadedDate}</TableHead>
                  <TableHead>{t.assignedOfficer}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>{t.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.applicant}</TableCell>
                    <TableCell>{payment.trackingId}</TableCell>
                    <TableCell>BDT {payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getPaymentMethodLabel(payment.paymentMethod)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            {t.viewPayslip}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Payslip - {payment.trackingId}</DialogTitle>
                          </DialogHeader>
                          <div className="p-4">
                            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                              <p className="text-gray-500">Payslip Image Preview</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>{payment.uploadedDate}</TableCell>
                    <TableCell>
                      {payment.assignedOfficer ? (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="text-sm">{payment.assignedOfficer}</span>
                        </div>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {t.assignOfficer}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t.assignOfficer}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>{t.selectOfficer}</Label>
                                <Select value={assignOfficer} onValueChange={setAssignOfficer}>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t.selectOfficer} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {officers.map((officer) => (
                                      <SelectItem key={officer} value={officer}>
                                        {officer}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <Button className="bg-deep-plum hover:bg-accent-purple">
                                  {t.submit}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {payment.status === 'pending' && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {t.verify}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{t.verifyPayment}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>{t.verificationNote}</Label>
                                    <Textarea 
                                      value={verificationNote}
                                      onChange={(e) => setVerificationNote(e.target.value)}
                                      placeholder="Add verification notes..."
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button className="bg-green-600 hover:bg-green-700">
                                      {t.verify}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  {t.reject}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{t.rejectPayment}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Rejection Reason</Label>
                                    <Textarea 
                                      placeholder="Enter reason for rejection..."
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="destructive">
                                      {t.reject}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
