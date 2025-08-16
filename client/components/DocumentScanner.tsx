import { useState } from 'react';
import { Camera, Upload, Scan, RotateCcw, Check, X, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface DocumentScannerProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'nid' | 'ssc' | 'hsc' | 'other';
  onDataExtracted: (data: any) => void;
  language?: 'en' | 'bn';
}

export default function DocumentScanner({ 
  isOpen, 
  onClose, 
  documentType, 
  onDataExtracted,
  language = 'en' 
}: DocumentScannerProps) {
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const texts = {
    en: {
      title: 'Document Scanner',
      nidTitle: 'NID Scanner',
      sscTitle: 'SSC Certificate Scanner',
      hscTitle: 'HSC Certificate Scanner',
      otherTitle: 'Document Scanner',
      selectMode: 'Select scanning mode',
      liveCamera: 'Live Camera',
      uploadImage: 'Upload Image',
      scanning: 'Scanning Document...',
      processing: 'Processing and extracting data...',
      extracting: 'Extracting information...',
      completed: 'Scan completed!',
      confidence: 'Confidence Score',
      extractedData: 'Extracted Data',
      preview: 'Preview',
      accept: 'Accept',
      retake: 'Retake',
      cancel: 'Cancel',
      dragDrop: 'Drag & drop an image here, or click to select',
      supportedFormats: 'Supported formats: JPG, PNG, PDF',
      name: 'Name',
      nidNumber: 'NID Number',
      dateOfBirth: 'Date of Birth',
      fatherName: "Father's Name",
      motherName: "Mother's Name",
      address: 'Address',
      board: 'Board',
      roll: 'Roll Number',
      regNumber: 'Registration Number',
      gpa: 'GPA',
      passingYear: 'Passing Year',
      institute: 'Institute Name',
      startScan: 'Start Scanning',
      capturePhoto: 'Capture Photo'
    },
    bn: {
      title: 'ডকুমেন্ট স্ক্যানার',
      nidTitle: 'এনআইডি স্ক্যানার',
      sscTitle: 'এসএসসি সনদপত্র স্ক্যানার',
      hscTitle: 'এইচএসসি সনদপত্র স্ক্যানার',
      otherTitle: 'ডকুমেন্ট স্ক্যানার',
      selectMode: 'স্ক্যানিং মোড নির্বাচন করুন',
      liveCamera: 'লাইভ ক্যামেরা',
      uploadImage: 'ছবি আপলোড করুন',
      scanning: 'ডকুমেন্ট স্ক্যান করা হচ্ছে...',
      processing: 'প্রক্রিয়াকরণ এবং ডেটা এক্সট্র্যাক্ট করা হচ্ছে...',
      extracting: 'তথ্য বের করা হচ্ছে...',
      completed: 'স্ক্যান সম্পন্ন!',
      confidence: 'আত্মবিশ্বাস স্কোর',
      extractedData: 'এক্সট্র্যাক্ট করা ডেটা',
      preview: 'প্রিভিউ',
      accept: 'গ্রহণ করুন',
      retake: 'পুনরায় ত��লুন',
      cancel: 'বাতিল',
      dragDrop: 'এখানে একটি ছবি টেনে আনুন, বা নির্বাচন করতে ক্লিক করুন',
      supportedFormats: 'সমর্থিত ফরম্যাট: JPG, PNG, PDF',
      name: 'নাম',
      nidNumber: 'এনআইডি নাম্বার',
      dateOfBirth: 'জন্ম তারিখ',
      fatherName: 'পিতার নাম',
      motherName: 'মাতার নাম',
      address: 'ঠিকানা',
      board: 'বোর্ড',
      roll: 'রোল নাম্বার',
      regNumber: 'রেজিস্ট্রেশন নাম্বার',
      gpa: 'জিপিএ',
      passingYear: 'পাসের বছর',
      institute: 'প্রতিষ্ঠানের নাম',
      startScan: 'স্ক্যান শুরু করুন',
      capturePhoto: 'ছবি তুলুন'
    }
  };

  const t = texts[language];

  const getDocumentTitle = () => {
    switch(documentType) {
      case 'nid': return t.nidTitle;
      case 'ssc': return t.sscTitle;
      case 'hsc': return t.hscTitle;
      default: return t.otherTitle;
    }
  };

  const getMockExtractedData = () => {
    switch(documentType) {
      case 'nid':
        return {
          name: 'Mohammad Rahman',
          nidNumber: '1234567890123',
          dateOfBirth: '1995-06-15',
          fatherName: 'Abdul Rahman',
          motherName: 'Fatima Rahman',
          address: 'Dhaka, Bangladesh'
        };
      case 'ssc':
        return {
          name: 'Mohammad Rahman',
          board: 'Dhaka Board',
          roll: '123456',
          regNumber: 'REG123456789',
          gpa: '5.00',
          passingYear: '2018',
          institute: 'Dhaka High School'
        };
      case 'hsc':
        return {
          name: 'Mohammad Rahman',
          board: 'Dhaka Board',
          roll: '234567',
          regNumber: 'REG234567890',
          gpa: '5.00',
          passingYear: '2020',
          institute: 'Dhaka College'
        };
      default:
        return {
          documentType: 'Unknown',
          extractedText: 'Sample extracted text...'
        };
    }
  };

  const handleStartScan = async (mode: 'camera' | 'upload') => {
    setScanMode(mode);
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Simulate data extraction
          const mockData = getMockExtractedData();
          setExtractedData(mockData);
          setConfidenceScore(Math.floor(Math.random() * 20) + 80); // 80-100%
          setShowPreview(true);
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleAccept = () => {
    onDataExtracted(extractedData);
    onClose();
    resetState();
  };

  const handleRetake = () => {
    resetState();
  };

  const resetState = () => {
    setScanMode(null);
    setIsScanning(false);
    setScanProgress(0);
    setExtractedData(null);
    setConfidenceScore(0);
    setShowPreview(false);
  };

  const renderModeSelection = () => (
    <div className="space-y-6">
      <p className="text-center text-gray-600">{t.selectMode}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-3 border-2 hover:border-accent-purple hover:bg-purple-50"
          onClick={() => handleStartScan('camera')}
        >
          <Camera className="w-8 h-8 text-accent-purple" />
          <span className="font-medium">{t.liveCamera}</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-3 border-2 hover:border-accent-purple hover:bg-purple-50"
          onClick={() => handleStartScan('upload')}
        >
          <Upload className="w-8 h-8 text-accent-purple" />
          <span className="font-medium">{t.uploadImage}</span>
        </Button>
      </div>

      {scanMode === 'upload' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-accent-purple transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{t.dragDrop}</p>
          <p className="text-sm text-gray-500">{t.supportedFormats}</p>
          <input type="file" className="hidden" accept="image/*,.pdf" />
        </div>
      )}
    </div>
  );

  const renderScanning = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scan className="w-12 h-12 text-accent-purple animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-deep-plum">{t.scanning}</h3>
        <p className="text-gray-600 mt-2">
          {scanProgress < 50 ? t.processing : t.extracting}
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{scanProgress}%</span>
        </div>
        <Progress value={scanProgress} className="h-2" />
      </div>

      {scanMode === 'camera' && (
        <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Camera preview</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-deep-plum">{t.completed}</h3>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-sm text-gray-600">{t.confidence}:</span>
          <Badge className={confidenceScore >= 90 ? "bg-green-100 text-green-800" : 
                           confidenceScore >= 70 ? "bg-yellow-100 text-yellow-800" : 
                           "bg-red-100 text-red-800"}>
            {confidenceScore}%
          </Badge>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h4 className="font-semibold text-deep-plum mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          {t.extractedData}
        </h4>
        <div className="space-y-2">
          {Object.entries(extractedData || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
              <span className="text-sm font-medium text-gray-600 capitalize">
                {t[key as keyof typeof t] || key}:
              </span>
              <span className="text-sm text-gray-900">{value as string}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleRetake} variant="outline" className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.retake}
        </Button>
        <Button onClick={handleAccept} className="flex-1 bg-deep-plum hover:bg-accent-purple">
          <Check className="w-4 h-4 mr-2" />
          {t.accept}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
            <Scan className="w-5 h-5" />
            {getDocumentTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {!scanMode && !isScanning && !showPreview && renderModeSelection()}
          {isScanning && renderScanning()}
          {showPreview && renderPreview()}
        </div>

        {!isScanning && !showPreview && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              {t.cancel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
