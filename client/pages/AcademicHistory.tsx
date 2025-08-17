import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Save, LogOut, Plus, Scan, FileText, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import DocumentUpload from '../components/DocumentUpload';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function AcademicHistory() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [academicRecords, setAcademicRecords] = useState([
    { id: 1, type: 'secondary', filled: false },
    { id: 2, type: 'higher_secondary', filled: false }
  ]);

  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});

  const texts = {
    en: {
      title: 'Academic History & Document Uploads',
      subtitle: 'Step 3 of 4',
      backToPrevious: 'Back to Personal Information',
      saveAndContinue: 'Save & Continue',
      saveAndExit: 'Save & Exit',
      instituteName: 'Institute Name',
      board: 'Board',
      degree: 'Degree',
      result: 'Result',
      passingYear: 'Passing Year',
      location: 'Location',
      uploadDocs: 'Upload Documents',
      documentScanner: 'Document Scanner',
      scanToFill: 'Scan to Auto-fill',
      secondary: 'Secondary or Equivalent',
      higherSecondary: 'Higher Secondary or Equivalent',
      addRecord: 'Add Academic Record',
      certificate: 'Certificate',
      marksheet: 'Marksheet',
      testimonial: 'Testimonial',
      transferCertificate: 'Transfer Certificate',
      gpa: 'GPA',
      cgpa: 'CGPA',
      division: 'Division',
      required: 'Required',
      optional: 'Optional',
      feeBreakdown: 'Fee Breakdown',
      admissionFee: 'Admission Fee',
      courseFee: 'Course Fee',
      labFee: 'Lab Fee',
      others: 'Others',
      total: 'Total',
      removeRecord: 'Remove Record'
    },
    bn: {
      title: 'শিক্ষাগত ইতিহাস এবং কাগজপত্র আপলোড',
      subtitle: '৪টি ধাপের ৩য় ধাপ',
      backToPrevious: 'ব্যক্তিগত তথ্যে ফিরুন',
      saveAndContinue: 'সেভ করে এগিয়ে যান',
      saveAndExit: 'সেভ করে বেরিয়ে যান',
      instituteName: 'শিক্ষা প্রতিষ্ঠানের নাম',
      board: 'বোর্ড',
      degree: 'ডিগ্রী',
      result: 'ফলাফল',
      passingYear: 'পাসের বছর',
      location: 'অবস্থান',
      uploadDocs: 'কাগজপত্র আপলোড করুন',
      documentScanner: 'ডকুমেন্ট স্ক্যানার',
      scanToFill: 'স্ক্যান করে অটো-ফিল করুন',
      secondary: 'মাধ্যমিক বা সমমান',
      higherSecondary: 'উচ্চ মাধ্যমিক বা সমমান',
      addRecord: 'শিক্��াগত রেকর্ড যোগ করুন',
      certificate: 'সনদপত্র',
      marksheet: 'নম্বরপত্র',
      testimonial: 'প্রশংসাপত্র',
      transferCertificate: 'স্থানান্তর সনদ',
      gpa: 'জিপিএ',
      cgpa: 'সিজিপিএ',
      division: 'বিভাগ',
      required: 'প্রয়োজনীয়',
      optional: 'ঐচ্ছিক',
      feeBreakdown: 'ফি বিভাজন',
      admissionFee: 'ভর্তি ফি',
      courseFee: 'কোর্স ফি',
      labFee: 'ল্যাব ফি',
      others: 'অন্যান্য',
      total: 'মোট',
      removeRecord: 'রেকর্ড মুছুন'
    }
  };

  const t = texts[language];

  const addAcademicRecord = () => {
    const newId = Math.max(...academicRecords.map(r => r.id)) + 1;
    setAcademicRecords([...academicRecords, { 
      id: newId, 
      type: 'other', 
      filled: false 
    }]);
  };

  const removeRecord = (id: number) => {
    setAcademicRecords(academicRecords.filter(record => record.id !== id));
  };

  const getDegreeLabel = (type: string) => {
    switch(type) {
      case 'secondary': return t.secondary;
      case 'higher_secondary': return t.higherSecondary;
      default: return 'Other Degree';
    }
  };

  const documentTypes = [
    { key: 'certificate', label: t.certificate, required: true },
    { key: 'marksheet', label: t.marksheet, required: true },
    { key: 'testimonial', label: t.testimonial, required: false },
    { key: 'transfer', label: t.transferCertificate, required: false }
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/personal-information" className="inline-flex items-center text-accent-purple hover:text-deep-plum mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToPrevious}
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {t.title}
              </h1>
              <p className="text-accent-purple font-medium">{t.subtitle}</p>
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

        {/* Document Scanner Section */}
        <Card className="bg-gradient-to-r from-mint-green to-green-50 border-green-200 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
              <Scan className="w-5 h-5" />
              {t.documentScanner}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{t.scanToFill}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white">
                <Scan className="w-4 h-4 mr-2" />
                NID
              </Button>
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white">
                <Scan className="w-4 h-4 mr-2" />
                {t.secondary}
              </Button>
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white">
                <Scan className="w-4 h-4 mr-2" />
                {t.higherSecondary}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Academic Records */}
            {academicRecords.map((record, index) => (
              <Card key={record.id} className="bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-poppins text-deep-plum">
                    {getDegreeLabel(record.type)} #{index + 1}
                  </CardTitle>
                  {academicRecords.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRecord(record.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t.removeRecord}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor={`institute-${record.id}`}>
                        {t.instituteName} <span className="text-red-500">*</span>
                      </Label>
                      <Input id={`institute-${record.id}`} placeholder="Enter institute name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`board-${record.id}`}>
                        {t.board} <span className="text-red-500">*</span>
                      </Label>
                      <Input id={`board-${record.id}`} placeholder="Enter board name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${record.id}`}>
                        {t.degree} <span className="text-red-500">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="secondary">{t.secondary}</SelectItem>
                          <SelectItem value="higher_secondary">{t.higherSecondary}</SelectItem>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`location-${record.id}`}>
                        {t.location}
                      </Label>
                      <Input id={`location-${record.id}`} placeholder="Enter location" />
                    </div>
                  </div>

                  {/* Result Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor={`result-${record.id}`}>
                        {t.result} <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Select>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpa">{t.gpa}</SelectItem>
                            <SelectItem value="cgpa">{t.cgpa}</SelectItem>
                            <SelectItem value="division">{t.division}</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Enter result" className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`year-${record.id}`}>
                        {t.passingYear} <span className="text-red-500">*</span>
                      </Label>
                      <Input id={`year-${record.id}`} type="number" placeholder="2024" min="1950" max="2024" />
                    </div>
                  </div>

                  {/* Document Upload Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-deep-plum mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {t.uploadDocs}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documentTypes.map((docType) => (
                        <div key={docType.key} className="space-y-2">
                          <Label className="flex items-center gap-2">
                            {docType.label}
                            {docType.required ? (
                              <span className="text-red-500 text-sm">({t.required})</span>
                            ) : (
                              <span className="text-gray-500 text-sm">({t.optional})</span>
                            )}
                          </Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-purple transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click or drag file here</p>
                            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add More Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={addAcademicRecord}
                className="border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.addRecord}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button variant="outline" className="border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                {t.saveAndExit}
              </Button>
              <Link to="/review-payment">
                <Button className="bg-deep-plum hover:bg-accent-purple">
                  <Save className="w-4 h-4 mr-2" />
                  {t.saveAndContinue}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Sidebar - Fee Breakdown */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-deep-plum text-white">
                <CardTitle className="font-poppins">{t.feeBreakdown}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.admissionFee}</span>
                    <span className="font-semibold">BDT 15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.courseFee}</span>
                    <span className="font-semibold">BDT 45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.labFee}</span>
                    <span className="font-semibold">BDT 8,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.others}</span>
                    <span className="font-semibold">BDT 5,000</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span className="text-deep-plum">{t.total}</span>
                    <span className="text-accent-purple">BDT 73,000</span>
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
