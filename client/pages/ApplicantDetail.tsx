import { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, MapPin, GraduationCap, FileText, CreditCard, Lock, Unlock, CheckCircle, XCircle, Clock, Download, MessageSquare, Shield, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import {
  generateStudentIDPair,
  sendUniversityIdViaSMS,
  sendUniversityIdViaEmail,
  type StudentIDPair
} from '../lib/idGeneration';

export default function ApplicantDetail() {
  const { id } = useParams<{ id: string }>();
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [isLocked, setIsLocked] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('under_review');
  const [paymentStatus, setPaymentStatus] = useState('verified');
  const [notes, setNotes] = useState('');

  // ID Generation state
  const [studentIDs, setStudentIDs] = useState<StudentIDPair | null>(null);
  const [isGeneratingIDs, setIsGeneratingIDs] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const texts = {
    en: {
      title: 'Applicant Details',
      backToList: 'Back to Admission List',
      admissionStatus: 'Admission Status',
      paymentStatus: 'Payment Status',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      academicHistory: 'Academic History',
      documentsUploaded: 'Documents Uploaded',
      waiverInfo: 'Waiver Information',
      invoicePreview: 'Invoice Preview',
      actions: 'Actions',
      approve: 'Approve Application',
      hold: 'Put on Hold',
      reject: 'Reject Application',
      lock: 'Lock Application',
      unlock: 'Unlock Application',
      createId: 'Create Student ID',
      sendEmail: 'Send Email',
      sendSMS: 'Send SMS',
      downloadInvoice: 'Download Invoice',
      underReview: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      onHold: 'On Hold',
      pending: 'Pending',
      verified: 'Verified',
      failed: 'Failed',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      address: 'Address',
      nationality: 'Nationality',
      trackingId: 'Tracking ID',
      applicationDate: 'Application Date',
      program: 'Program',
      department: 'Department',
      semester: 'Semester',
      sscResults: 'SSC Results',
      hscResults: 'HSC Results',
      sscCertificate: 'SSC Certificate',
      hscCertificate: 'HSC Certificate',
      nidCopy: 'NID Copy',
      photograph: 'Photograph',
      testimonial: 'Testimonial',
      uploaded: 'Uploaded',
      notUploaded: 'Not Uploaded',
      waiverType: 'Waiver Type',
      waiverPercentage: 'Waiver Percentage',
      originalAmount: 'Original Amount',
      waiverAmount: 'Waiver Amount',
      finalAmount: 'Final Amount',
      admissionFee: 'Admission Fee',
      courseFee: 'Course Fee',
      labFee: 'Lab Fee',
      others: 'Others',
      total: 'Total',
      approvalNote: 'Approval Note',
      rejectionReason: 'Rejection Reason',
      studentId: 'Student ID',
      applicantId: 'Applicant ID',
      password: 'Password',
      confirmApproval: 'Confirm Approval',
      confirmRejection: 'Confirm Rejection',
      studentIDs: 'Student IDs',
      universityId: 'University ID',
      ugcId: 'UGC ID',
      generateIDs: 'Generate Student IDs',
      sendSMSId: 'Send ID via SMS',
      sendEmailId: 'Send ID via Email',
      idsGenerated: 'Student IDs Generated Successfully',
      smsSent: 'SMS sent successfully',
      emailSent: 'Email sent successfully',
      batch: 'Batch',
      generatedOn: 'Generated On',
      idStatus: 'ID Status',
      active: 'Active',
      inactive: 'Inactive',
      ugcNote: 'UGC ID is used for certificate authorization and is visible only to admin staff.'
    },
    bn: {
      title: 'আবেদনকারীর ব��বরণ',
      backToList: 'ভর্তি তালিকায় ফিরুন',
      admissionStatus: 'ভর্তির অবস্থা',
      paymentStatus: 'পেমেন্ট অবস্থা',
      personalInfo: 'ব্যক্তিগত তথ্য',
      contactInfo: 'যোগাযোগের তথ্য',
      academicHistory: 'শিক্ষাগত ইতিহাস',
      documentsUploaded: 'আপলোডকৃত কাগজপত্র',
      waiverInfo: 'মওকুফ তথ্য',
      invoicePreview: 'ইনভয়েস প্রিভিউ',
      actions: 'কর্ম',
      approve: 'আবেদন অনুমোদন',
      hold: 'স্থগিত রাখুন',
      reject: 'আবেদন প্রত্যাখ্যান',
      lock: 'আবেদন লক করুন',
      unlock: 'আবেদন আনলক করুন',
      createId: 'ছাত্র আইডি তৈরি করুন',
      sendEmail: 'ইমেইল পাঠান',
      sendSMS: 'এসএমএস পাঠান',
      downloadInvoice: 'ইনভয়েস ডাউনলোড',
      underReview: 'পর্যালোচনাধীন',
      approved: 'অনুমোদিত',
      rejected: 'প্রত্যাখ্যাত',
      onHold: 'স্থগিত',
      pending: 'অপেক্ষমাণ',
      verified: 'যাচাইকৃত',
      failed: 'ব্যর্থ',
      name: 'নাম',
      email: 'ইমেইল',
      phone: 'ফোন',
      dateOfBirth: 'জন��ম তারিখ',
      gender: 'লিঙ্গ',
      address: 'ঠিকানা',
      nationality: 'জাতীয়তা',
      trackingId: 'ট্র্যাকিং আইডি',
      applicationDate: 'আবেদনের তারিখ',
      program: 'প্��োগ্রাম',
      department: 'বিভাগ',
      semester: 'সেমিস্টার',
      sscResults: 'এসএসসি ফলাফল',
      hscResults: 'এইচএসসি ফলাফল',
      sscCertificate: 'এসএসসি সনদপত্র',
      hscCertificate: 'এইচএসসি সনদপত্র',
      nidCopy: 'এনআইডি কপি',
      photograph: 'ছবি',
      testimonial: 'প্রশংসাপত্র',
      uploaded: 'আপলোড করা হয়েছে',
      notUploaded: 'আপলোড করা হয়নি',
      waiverType: 'মওকুফের ধর��',
      waiverPercentage: 'মওকুফ শতাংশ',
      originalAmount: 'মূল পরিমাণ',
      waiverAmount: 'মওকুফ পরিমাণ',
      finalAmount: 'চূড়ান্ত পরিমাণ',
      admissionFee: 'ভর্তি ফি',
      courseFee: 'কোর্স ফি',
      labFee: 'ল্যাব ফি',
      others: 'অন্যান্য',
      total: 'মোট',
      approvalNote: 'অনুমোদনের নোট',
      rejectionReason: 'প্রত্যাখ্যানের কারণ',
      studentId: 'ছাত্র আইডি',
      applicantId: 'আবেদনকারী আইডি',
      password: 'পাসওয়ার্ড',
      confirmApproval: 'অনুমোদন নিশ্চিত করুন',
      confirmRejection: 'প্রত্যাখ্যান নিশ্চিত করুন',
      studentIDs: 'ছাত্র আইডিসমূহ',
      universityId: 'ব��শ্ববিদ্যালয় আইডি',
      ugcId: 'ইউজিসি আইডি',
      generateIDs: 'ছাত্র আইডি তৈরি করুন',
      sendSMSId: 'এসএমএসে আইডি পাঠান',
      sendEmailId: 'ইমেইলে আইডি পাঠান',
      idsGenerated: 'ছাত্র আইডি ����ফলভাবে তৈরি হয়েছে',
      smsSent: 'এসএমএস সফলভাবে পাঠানো হয়েছে',
      emailSent: 'ইমেইল সফলভাবে পাঠানো হয়েছে',
      batch: 'ব্যাচ',
      generatedOn: 'তৈরির তারিখ',
      idStatus: 'আইডি অবস্থা',
      active: 'সক্রিয়',
      inactive: 'নিষ্ক্রিয়',
      ugcNote: 'ইউজিসি আইডি সনদপত্র অনুমোদনের জন্য ব্যবহৃত হয় এবং শুধুমাত্র প্রশাসনিক কর্মীদের কাছে দৃশ্যমান।'
    }
  };

  const t = texts[language];

  const applicantData = {
    trackingId: `NU2024001${id || '234'}`,
    applicationDate: '2024-01-15',
    personalInfo: {
      name: 'Mohammad Rahman',
      email: 'rahman@email.com',
      phone: '+880 1234567890',
      dateOfBirth: '1995-06-15',
      gender: 'Male',
      address: 'Dhaka, Bangladesh',
      nationality: 'Bangladeshi'
    },
    program: {
      program: 'BSc in Computer Science',
      department: 'Computer Science & Engineering',
      semester: 'Spring 2024'
    },
    academic: {
      ssc: { board: 'Dhaka Board', gpa: '5.00', year: '2018' },
      hsc: { board: 'Dhaka Board', gpa: '5.00', year: '2020' }
    },
    documents: {
      sscCertificate: true,
      hscCertificate: true,
      nidCopy: true,
      photograph: true,
      testimonial: false
    },
    waiver: {
      type: 'Merit-based',
      percentage: 25,
      originalAmount: 73000,
      waiverAmount: 18250,
      finalAmount: 54750
    }
  };

  const getStatusBadge = (status: string, type: 'admission' | 'payment') => {
    const statusConfigs = {
      admission: {
        under_review: { color: 'bg-yellow-100 text-yellow-800', label: t.underReview, icon: Clock },
        approved: { color: 'bg-green-100 text-green-800', label: t.approved, icon: CheckCircle },
        rejected: { color: 'bg-red-100 text-red-800', label: t.rejected, icon: XCircle },
        on_hold: { color: 'bg-gray-100 text-gray-800', label: t.onHold, icon: Clock }
      },
      payment: {
        pending: { color: 'bg-yellow-100 text-yellow-800', label: t.pending, icon: Clock },
        verified: { color: 'bg-green-100 text-green-800', label: t.verified, icon: CheckCircle },
        failed: { color: 'bg-red-100 text-red-800', label: t.failed, icon: XCircle }
      }
    } as const;

    const typeConfig = statusConfigs[type];
    const config = typeConfig[status as keyof typeof typeConfig];

    if (!config) {
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }

    const IconComponent = config.icon;
    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleApprove = () => {
    setApplicationStatus('approved');

    // Automatically generate IDs upon approval
    if (!studentIDs) {
      setTimeout(() => {
        handleGenerateIDs();
      }, 1000);
    }
  };

  const handleReject = () => {
    setApplicationStatus('rejected');
  };

  const handleHold = () => {
    setApplicationStatus('on_hold');
  };

  const handleGenerateIDs = () => {
    setIsGeneratingIDs(true);

    // Simulate ID generation with delay
    setTimeout(() => {
      const ids = generateStudentIDPair(
        applicantData.personalInfo.name,
        'bachelor', // Would come from application data
        'cse', // Would come from application data
        2024,
        Math.floor(Math.random() * 100) + 1
      );

      setStudentIDs(ids);
      setIsGeneratingIDs(false);
    }, 2000);
  };

  const handleSendSMS = async () => {
    if (!studentIDs) return;

    setSendingSMS(true);
    try {
      await sendUniversityIdViaSMS(
        applicantData.personalInfo.phone,
        studentIDs.universityId,
        applicantData.personalInfo.name
      );
      // Show success message
    } catch (error) {
      console.error('SMS sending failed:', error);
    }
    setSendingSMS(false);
  };

  const handleSendEmail = async () => {
    if (!studentIDs) return;

    setSendingEmail(true);
    try {
      await sendUniversityIdViaEmail(
        applicantData.personalInfo.email,
        studentIDs.universityId,
        applicantData.personalInfo.name
      );
      // Show success message
    } catch (error) {
      console.error('Email sending failed:', error);
    }
    setSendingEmail(false);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin/admissions" className="inline-flex items-center text-accent-purple hover:text-deep-plum mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToList}
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {t.title} - {applicantData.trackingId}
              </h1>
              <p className="text-gray-600 mt-1">{applicantData.personalInfo.name}</p>
            </div>
            
            {/* Language Toggle */}
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

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className={`shadow-lg ${
            applicationStatus === 'approved' ? 'bg-green-50 border-green-200' :
            applicationStatus === 'rejected' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <CardHeader>
              <CardTitle className="text-lg font-poppins text-deep-plum">
                {t.admissionStatus}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {getStatusBadge(applicationStatus, 'admission')}
                <div className="flex items-center gap-2">
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isLocked ? 'Locked' : 'Unlocked'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-lg ${
            paymentStatus === 'verified' ? 'bg-green-50 border-green-200' :
            paymentStatus === 'failed' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <CardHeader>
              <CardTitle className="text-lg font-poppins text-deep-plum">
                {t.paymentStatus}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(paymentStatus, 'payment')}
            </CardContent>
          </Card>
        </div>

        {/* Student IDs Section */}
        {(applicationStatus === 'approved' || studentIDs) && (
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-blue-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t.studentIDs}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentIDs ? (
                <div className="space-y-4">
                  {/* University ID - Visible to all */}
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-semibold text-blue-800">{t.universityId}</Label>
                      <Badge className="bg-green-600 text-white">{t.active}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 font-mono tracking-wider">
                      {studentIDs.universityId}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
                      <div><strong>{t.batch}:</strong> {studentIDs.batch}</div>
                      <div><strong>{t.generatedOn}:</strong> {new Date(studentIDs.generatedDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <Separator />

                  {/* UGC ID - Admin Only */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-semibold text-purple-800">{t.ugcId} (Admin Only)</Label>
                      <Badge className="bg-purple-600 text-white">Confidential</Badge>
                    </div>
                    <div className="text-xl font-bold text-purple-900 font-mono tracking-wider">
                      {studentIDs.ugcId}
                    </div>
                    <Alert className="mt-3 border-purple-200 bg-purple-50">
                      <AlertCircle className="w-4 h-4 text-purple-600" />
                      <AlertDescription className="text-purple-800 text-xs">
                        {t.ugcNote}
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Communication Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleSendSMS}
                      disabled={sendingSMS}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {sendingSMS ? 'Sending...' : t.sendSMSId}
                    </Button>
                    <Button
                      onClick={handleSendEmail}
                      disabled={sendingEmail}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {sendingEmail ? 'Sending...' : t.sendEmailId}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-gray-600 mb-4">
                    Applicant IDs not generated yet. Generate IDs after approval.
                  </div>
                  <Button
                    onClick={handleGenerateIDs}
                    disabled={isGeneratingIDs}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGeneratingIDs ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        {t.generateIDs}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t.personalInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.name}</Label>
                    <p className="text-gray-900">{applicantData.personalInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.dateOfBirth}</Label>
                    <p className="text-gray-900">{applicantData.personalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.gender}</Label>
                    <p className="text-gray-900">{applicantData.personalInfo.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.nationality}</Label>
                    <p className="text-gray-900">{applicantData.personalInfo.nationality}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-600">{t.address}</Label>
                    <p className="text-gray-900">{applicantData.personalInfo.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <Label className="text-sm font-medium text-gray-600">{t.email}</Label>
                      <p className="text-gray-900">{applicantData.personalInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <Label className="text-sm font-medium text-gray-600">{t.phone}</Label>
                      <p className="text-gray-900">{applicantData.personalInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic History */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  {t.academicHistory}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.sscResults}</Label>
                    <p className="text-gray-900">
                      {applicantData.academic.ssc.board} - GPA {applicantData.academic.ssc.gpa} ({applicantData.academic.ssc.year})
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.hscResults}</Label>
                    <p className="text-gray-900">
                      {applicantData.academic.hsc.board} - GPA {applicantData.academic.hsc.gpa} ({applicantData.academic.hsc.year})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t.documentsUploaded}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(applicantData.documents).map(([key, uploaded]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        {t[key as keyof typeof t] || key}
                      </span>
                      <Badge className={uploaded ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {uploaded ? t.uploaded : t.notUploaded}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Waiver Information */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t.waiverInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.waiverType}</Label>
                    <p className="text-gray-900">{applicantData.waiver.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.waiverPercentage}</Label>
                    <p className="text-gray-900">{applicantData.waiver.percentage}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.originalAmount}</Label>
                    <p className="text-gray-900">BDT {applicantData.waiver.originalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t.waiverAmount}</Label>
                    <p className="text-green-600 font-semibold">-BDT {applicantData.waiver.waiverAmount.toLocaleString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-600">{t.finalAmount}</Label>
                    <p className="text-xl font-bold text-accent-purple">BDT {applicantData.waiver.finalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Actions */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum">
                  {t.actions}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isLocked && applicationStatus === 'under_review' && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t.approve}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t.confirmApproval}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>{t.approvalNote}</Label>
                            <Textarea placeholder="Add approval notes..." />
                          </div>
                          <div className="space-y-2">
                            <Label>{t.applicantId}</Label>
                            <Input value="NU24CS001234" readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label>{t.password}</Label>
                            <Input value="temp123456" readOnly />
                          </div>
                          <Button onClick={handleApprove} className="w-full bg-green-600 hover:bg-green-700">
                            {t.confirmApproval}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button onClick={handleHold} variant="outline" className="w-full">
                      <Clock className="w-4 h-4 mr-2" />
                      {t.hold}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <XCircle className="w-4 h-4 mr-2" />
                          {t.reject}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t.confirmRejection}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>{t.rejectionReason}</Label>
                            <Textarea placeholder="Enter reason for rejection..." required />
                          </div>
                          <Button onClick={handleReject} variant="destructive" className="w-full">
                            {t.confirmRejection}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}

                <div className="border-t pt-3">
                  <Button
                    onClick={() => setIsLocked(!isLocked)}
                    variant="outline"
                    className="w-full"
                  >
                    {isLocked ? (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        {t.unlock}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {t.lock}
                      </>
                    )}
                  </Button>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    {t.sendEmail}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t.sendSMS}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    {t.downloadInvoice}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Preview */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum">
                  {t.invoicePreview}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>{t.admissionFee}</span>
                    <span>BDT 15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.courseFee}</span>
                    <span>BDT 45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.labFee}</span>
                    <span>BDT 8,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.others}</span>
                    <span>BDT 5,000</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span>Subtotal</span>
                    <span>BDT 73,000</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Waiver (25%)</span>
                    <span>-BDT 18,250</span>
                  </div>
                  <div className="border-t-2 pt-2 flex justify-between font-bold text-lg">
                    <span>{t.total}</span>
                    <span className="text-accent-purple">BDT 54,750</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
