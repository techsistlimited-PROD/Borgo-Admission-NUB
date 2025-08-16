import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, LogOut, Download, CreditCard, Calculator, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

export default function WaiverEligibility() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [waiverPercentage, setWaiverPercentage] = useState(0);

  const texts = {
    en: {
      title: 'Waiver Eligibility & Cost Estimation',
      subtitle: 'Step 4 of 5',
      backToPrevious: 'Back to Academic History',
      saveAndContinue: 'Proceed to Submit',
      saveAndExit: 'Save & Exit',
      waiverPolicy: 'Waiver Policy',
      eligibilityCriteria: 'Eligibility Criteria',
      costEstimation: 'Cost Estimation',
      savePDF: 'Save Estimate as PDF',
      meritBased: 'Merit-based Scholarship',
      meritDesc: 'Based on academic performance (GPA 4.5+)',
      needBased: 'Need-based Financial Aid',
      needDesc: 'Based on family income and financial situation',
      sportsScholarship: 'Sports Scholarship',
      sportsDesc: 'For students with exceptional sports achievements',
      culturalScholarship: 'Cultural Scholarship',
      culturalDesc: 'For students with cultural and artistic talents',
      disabilitySupport: 'Disability Support',
      disabilityDesc: 'For students with special needs',
      ruralStudent: 'Rural Area Student',
      ruralDesc: 'For students from rural and remote areas',
      originalFee: 'Original Fee',
      waiverAmount: 'Waiver Amount',
      finalAmount: 'Final Amount',
      waiverPercent: 'Waiver Percentage',
      admissionFee: 'Admission Fee',
      tuitionCredit: 'Tuition per Credit',
      courseFee: 'Course Fee',
      labFee: 'Lab Fee',
      libraryFee: 'Library Fee',
      others: 'Others',
      total: 'Total',
      qualified: 'Qualified',
      notQualified: 'Not Qualified',
      checkEligibility: 'Check Eligibility',
      policyDetails: 'Policy Details',
      waiverDescription: 'Northern University Bangladesh offers various scholarship and waiver programs to support deserving students. Waivers are awarded based on merit, financial need, and special circumstances.',
      maxWaiver: 'Maximum waiver: 50% of tuition fees',
      applicationDeadline: 'Application deadline: Before semester starts',
      renewalCriteria: 'Renewal based on academic performance'
    },
    bn: {
      title: 'মওকুফ যোগ্যতা এবং খরচ অনুমান',
      subtitle: '৫টি ধাপের ৪র্থ ধাপ',
      backToPrevious: 'শিক্ষাগত ইতিহাসে ফিরুন',
      saveAndContinue: 'জমা দিতে এগিয়ে যান',
      saveAndExit: 'সেভ করে বেরিয়ে যান',
      waiverPolicy: 'মওকুফ নীতি',
      eligibilityCriteria: 'যোগ্যতার মানদণ্ড',
      costEstimation: 'খরচ অনুমান',
      savePDF: 'পিডিএফ হিসাবে সেভ করুন',
      meritBased: 'মেধাভিত্তিক বৃত্তি',
      meritDesc: 'একাডেমিক পারফরম্যান্��ের ভিত্তিতে (জিপিএ ৪.৫+)',
      needBased: 'প্রয়োজনভিত্তিক আর্থিক সহায়তা',
      needDesc: 'পারিবারিক আয় এবং আর্থিক অবস্থার ভিত্তিতে',
      sportsScholarship: 'ক্রীড়া বৃত্তি',
      sportsDesc: 'ব্যতিক্রমী ক্রীড়া অর্জনের জন্য',
      culturalScholarship: 'সাংস্কৃতিক বৃত্তি',
      culturalDesc: 'সাংস্কৃতিক এবং শৈল্পিক প্রতিভার জন্য',
      disabilitySupport: 'প্রতিবন্ধী সহায়তা',
      disabilityDesc: 'বিশেষ চাহিদাসম্পন্ন শিক্ষার্থীদের জন্য',
      ruralStudent: 'গ্রামীণ এলাকার শিক্ষার্থী',
      ruralDesc: 'গ্রামীণ এবং দুর্গম এলাকার শিক্ষার্থীদের জন্য',
      originalFee: 'মূল ফি',
      waiverAmount: 'মওকুফ পরিমাণ',
      finalAmount: 'চূড়ান্ত পরিমাণ',
      waiverPercent: 'মওক���ফ শতাংশ',
      admissionFee: 'ভর্তি ফি',
      tuitionCredit: 'প্রতি ক্রেডিট টিউশন',
      courseFee: 'কোর্স ফি',
      labFee: 'ল্যাব ফি',
      libraryFee: 'লাইব্রেরি ফি',
      others: 'অন্যান্য',
      total: 'মোট',
      qualified: 'যোগ্য',
      notQualified: 'অযোগ্য',
      checkEligibility: 'যোগ্যতা যাচাই করুন',
      policyDetails: 'নীতি বিবরণ',
      waiverDescription: 'নর্দার্ন ইউনিভার্সিটি বাংলাদেশ যোগ্য শিক্ষার্থীদের সহায়তার জন্য বিভিন্ন বৃত্তি এবং মওকুফ প্রোগ্রাম অফার করে। মেধা, আর্থিক প্রয়োজন এবং বিশেষ পরিস্থিতির ভিত্তিতে মওকুফ প্রদান করা হয়।',
      maxWaiver: 'সর্বোচ্চ মওকুফ: টিউশন ফির ৫০%',
      applicationDeadline: 'আবেদনের শেষ তারিখ: সেমিস্টার শুরুর আগে',
      renewalCriteria: 'একাডেমিক পারফরম্যান্সের ভিত্তিতে নবায়ন'
    }
  };

  const t = texts[language];

  const waiverCriteria = [
    { id: 'merit', label: t.meritBased, description: t.meritDesc, waiverValue: 25 },
    { id: 'need', label: t.needBased, description: t.needDesc, waiverValue: 20 },
    { id: 'sports', label: t.sportsScholarship, description: t.sportsDesc, waiverValue: 15 },
    { id: 'cultural', label: t.culturalScholarship, description: t.culturalDesc, waiverValue: 10 },
    { id: 'disability', label: t.disabilitySupport, description: t.disabilityDesc, waiverValue: 20 },
    { id: 'rural', label: t.ruralStudent, description: t.ruralDesc, waiverValue: 10 }
  ];

  const feeStructure = [
    { label: t.admissionFee, amount: 15000, eligible: false },
    { label: t.tuitionCredit, amount: 3000, eligible: true, credits: 15 }, // 45,000 total
    { label: t.courseFee, amount: 8000, eligible: true },
    { label: t.labFee, amount: 8000, eligible: true },
    { label: t.libraryFee, amount: 2000, eligible: true },
    { label: t.others, amount: 5000, eligible: false }
  ];

  const handleCriteriaChange = (criteriaId: string, checked: boolean) => {
    let newSelected = [...selectedCriteria];
    if (checked) {
      newSelected.push(criteriaId);
    } else {
      newSelected = newSelected.filter(id => id !== criteriaId);
    }
    setSelectedCriteria(newSelected);

    // Calculate waiver percentage
    const totalWaiver = newSelected.reduce((sum, id) => {
      const criteria = waiverCriteria.find(c => c.id === id);
      return sum + (criteria?.waiverValue || 0);
    }, 0);
    setWaiverPercentage(Math.min(totalWaiver, 50)); // Max 50%
  };

  const calculateFees = () => {
    const originalTotal = feeStructure.reduce((sum, fee) => {
      if (fee.credits) {
        return sum + (fee.amount * fee.credits);
      }
      return sum + fee.amount;
    }, 0);

    const eligibleForWaiver = feeStructure.reduce((sum, fee) => {
      if (fee.eligible) {
        if (fee.credits) {
          return sum + (fee.amount * fee.credits);
        }
        return sum + fee.amount;
      }
      return sum;
    }, 0);

    const waiverAmount = Math.round((eligibleForWaiver * waiverPercentage) / 100);
    const finalTotal = originalTotal - waiverAmount;

    return { originalTotal, waiverAmount, finalTotal };
  };

  const { originalTotal, waiverAmount, finalTotal } = calculateFees();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/academic-history" className="inline-flex items-center text-accent-purple hover:text-deep-plum mb-4">
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

        {/* Waiver Policy Banner */}
        <Card className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-poppins text-deep-plum flex items-center gap-2">
              <Award className="w-6 h-6" />
              {t.waiverPolicy}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{t.waiverDescription}</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• {t.maxWaiver}</li>
              <li>• {t.applicationDeadline}</li>
              <li>• {t.renewalCriteria}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Eligibility Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t.eligibilityCriteria}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {waiverCriteria.map((criteria) => {
                  const isSelected = selectedCriteria.includes(criteria.id);
                  return (
                    <div key={criteria.id} className={`p-4 border rounded-lg transition-colors ${
                      isSelected ? 'border-accent-purple bg-purple-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={criteria.id}
                          checked={isSelected}
                          onCheckedChange={(checked) => handleCriteriaChange(criteria.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={criteria.id} className="text-base font-semibold text-deep-plum cursor-pointer">
                              {criteria.label}
                            </Label>
                            <Badge variant={isSelected ? "default" : "outline"} className={
                              isSelected ? "bg-accent-purple" : ""
                            }>
                              {criteria.waiverValue}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{criteria.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Current Waiver Status */}
                <div className="mt-6 p-4 bg-mint-green rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-deep-plum">{t.waiverPercent}:</span>
                    <span className="text-2xl font-bold text-accent-purple">{waiverPercentage}%</span>
                  </div>
                  <div className="mt-2">
                    <Badge className={waiverPercentage > 0 ? "bg-green-600" : "bg-gray-400"}>
                      {waiverPercentage > 0 ? t.qualified : t.notQualified}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Button 
                variant="outline" 
                className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.savePDF}
              </Button>
              
              <div className="flex gap-4">
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
          </div>

          {/* Right Side - Fee Breakdown */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-deep-plum text-white">
                <CardTitle className="font-poppins flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {t.costEstimation}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Original Fees */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-deep-plum">{t.originalFee}:</h4>
                  {feeStructure.map((fee, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {fee.label}
                        {fee.credits && ` (${fee.credits} credits)`}
                      </span>
                      <span className="font-medium">
                        BDT {fee.credits ? (fee.amount * fee.credits).toLocaleString() : fee.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>{t.total}:</span>
                    <span>BDT {originalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Waiver Calculation */}
                {waiverPercentage > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <h4 className="font-semibold text-accent-purple">{t.waiverAmount}:</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{waiverPercentage}% waiver</span>
                      <span className="font-medium text-green-600">-BDT {waiverAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Final Amount */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-deep-plum">{t.finalAmount}:</span>
                    <span className="text-accent-purple">BDT {finalTotal.toLocaleString()}</span>
                  </div>
                  {waiverPercentage > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      You save BDT {waiverAmount.toLocaleString()}!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
