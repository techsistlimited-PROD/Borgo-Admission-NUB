import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Upload,
  CreditCard,
  Smartphone,
  Building,
  FileText,
  Check,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import paymentService, {
  paymentMethods,
  PaymentConfig,
} from "../lib/paymentService";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { Badge } from "../components/ui/badge";

export default function ReviewPayment() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    holderName: "",
  });
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    program: false,
    personal: false,
    academic: false,
    waiver: false,
  });

  const texts = {
    en: {
      title: "Review & Payment",
      subtitle: "Step 5 of 5",
      backToPrevious: "Back to Waiver Eligibility",
      submitApplication: "Submit Application",
      reviewApplication: "Review Your Application",
      paymentMethods: "Payment Methods",
      programSelection: "Program Selection",
      personalInfo: "Personal Information",
      academicHistory: "Academic History",
      waiverInfo: "Waiver Information",
      paymentDetails: "Payment Details",
      bkash: "bKash",
      rocket: "Rocket",
      card: "Credit/Debit Card",
      offline: "Offline Payment",
      payslipUpload: "Payslip Upload",
      transactionId: "Transaction ID",
      cardNumber: "Card Number",
      expiryDate: "Expiry Date",
      cvv: "CVV",
      cardHolderName: "Card Holder Name",
      mobileNumber: "Mobile Number",
      pin: "PIN",
      payNow: "Pay Now",
      uploadPayslip: "Upload Payslip",
      paymentInstructions: "Payment Instructions",
      bkashInstructions:
        "Send money to: 01700000000 and upload the transaction receipt",
      rocketInstructions:
        "Send money to: 017000000000 and upload the transaction receipt",
      offlineInstructions:
        "Pay at university cash counter and upload the receipt",
      totalAmount: "Total Amount",
      edit: "Edit",
      complete: "Complete",
      incomplete: "Incomplete",
      step: "Step",
    },
    bn: {
      title: "পর্যালোচনা ও পেমেন্ট",
      subtitle: "৫টি ধাপের ৫ম ধাপ",
      backToPrevious: "মওকুফ যোগ্যতায় ফিরুন",
      submitApplication: "আবেদন জমা দিন",
      reviewApplication: "আপনার আবেদন পর্যালোচনা করুন",
      paymentMethods: "পেমেন্ট পদ্ধতি",
      programSelection: "প্রোগ্রাম নির্বাচন",
      personalInfo: "ব্যক্তিগত তথ্য",
      academicHistory: "শিক্ষাগত ইতিহাস",
      waiverInfo: "মওকুফ তথ্য",
      paymentDetails: "পেমেন্ট বিবরণ",
      bkash: "বিকাশ",
      rocket: "র��েট",
      card: "ক্রেডিট/ডেবিট কার্ড",
      offline: "অফলাইন পেমেন্ট",
      payslipUpload: "পে-স্লিপ আপলোড করুন",
      transactionId: "লেনদেন আইডি",
      cardNumber: "কার্ড নাম্বার",
      expiryDate: "মেয��াদ শেষের তারিখ",
      cvv: "সিভিভি",
      cardHolderName: "কার্ডধারীর নাম",
      mobileNumber: "মোবাইল নাম্বার",
      pin: "পিন",
      payNow: "এখনই পেমেন্ট করুন",
      uploadPayslip: "পে-স্লিপ আপলোড করুন",
      paymentInstructions: "পেমেন্ট নির্দেশাবলী",
      bkashInstructions:
        "এই নাম্বারে টাকা পাঠান: ০১৭০০০০০০০০ এবং লেনদেনের রসিদ আপলোড করুন",
      rocketInstructions:
        "এই নাম্বারে টাকা পাঠান: ০১৭০০০০০০০০০ এবং লেনদেনের রসিদ আপলোড করুন",
      offlineInstructions:
        "বিশ্ববিদ্যালয়ের ক্যাশ কাউন���টারে পেমেন্ট করুন এবং রসিদ আপলোড করুন",
      totalAmount: "মোট পরিমাণ",
      edit: "সম্পাদনা",
      complete: "সম্পূর্ণ",
      incomplete: "অসম্পূর্ণ",
      step: "ধাপ",
    },
  };

  const t = texts[language];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const validateMobileNumber = (
    number: string,
    provider: "bkash" | "rocket",
  ): boolean => {
    const isValid = paymentService.validateMobileNumber(number, provider);
    setMobileError(
      isValid ? "" : "Please enter a valid Bangladesh mobile number",
    );
    return isValid;
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) return;

    setIsProcessingPayment(true);

    try {
      const paymentConfig: PaymentConfig = {
        amount: 54750, // Total amount from fee calculation
        currency: "BDT",
        applicationId: "NU2024001234", // Would come from application context
        userId: "user123", // Would come from auth context
        userEmail: "applicant@example.com",
        userPhone: mobileNumber,
      };

      let redirectUrl: string;

      switch (paymentMethod) {
        case "bkash":
          if (!validateMobileNumber(mobileNumber, "bkash")) return;
          redirectUrl = await paymentService.initiateBkashPayment(
            paymentConfig,
            mobileNumber,
          );
          break;

        case "rocket":
          if (!validateMobileNumber(mobileNumber, "rocket")) return;
          redirectUrl = await paymentService.initiateRocketPayment(
            paymentConfig,
            mobileNumber,
          );
          break;

        case "card":
          redirectUrl = await paymentService.initiateCardPayment(
            paymentConfig,
            cardData,
          );
          break;

        default:
          throw new Error("Invalid payment method");
      }

      // Record payment attempt
      await paymentService.recordPaymentAttempt(paymentConfig, paymentMethod, {
        mobileNumber:
          paymentMethod === "bkash" || paymentMethod === "rocket"
            ? mobileNumber
            : undefined,
        cardData:
          paymentMethod === "card"
            ? { last4: cardData.number.slice(-4) }
            : undefined,
      });

      // Redirect to payment provider
      window.open(
        redirectUrl,
        "_blank",
        "width=800,height=600,scrollbars=yes,resizable=yes",
      );

      // Show success message
      alert(
        "Payment window opened. Please complete the payment and return to this page.",
      );
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const reviewSections = [
    {
      id: "program",
      title: t.programSelection,
      status: "complete",
      step: 1,
      content: {
        "Program Type": "Undergraduate",
        Department: "Computer Science & Engineering",
        Program: "BSc in Computer Science",
        Semester: "Spring 2024",
      },
    },
    {
      id: "personal",
      title: t.personalInfo,
      status: "complete",
      step: 2,
      content: {
        "Full Name": "John Doe",
        "Date of Birth": "1995-06-15",
        Mobile: "+880 1234567890",
        Email: "john.doe@example.com",
        "Present Address": "Dhaka, Bangladesh",
      },
    },
    {
      id: "academic",
      title: t.academicHistory,
      status: "complete",
      step: 3,
      content: {
        SSC: "GPA 5.00 - 2018",
        HSC: "GPA 5.00 - 2020",
        Documents: "4/4 uploaded",
      },
    },
    {
      id: "waiver",
      title: t.waiverInfo,
      status: "complete",
      step: 4,
      content: {
        "Waiver Type": "Merit-based",
        "Waiver Percentage": "25%",
        "Original Amount": "BDT 73,000",
        "Final Amount": "BDT 54,750",
      },
    },
  ];

  const availablePaymentMethods = paymentMethods.map((method) => ({
    ...method,
    displayName:
      method.id === "bkash"
        ? t.bkash
        : method.id === "rocket"
          ? t.rocket
          : method.id === "card"
            ? t.card
            : t.offline,
    icon:
      method.id === "bkash" || method.id === "rocket" ? (
        <Smartphone className="w-5 h-5" />
      ) : method.id === "card" ? (
        <CreditCard className="w-5 h-5" />
      ) : (
        <Building className="w-5 h-5" />
      ),
    instructions:
      method.id === "bkash"
        ? t.bkashInstructions
        : method.id === "rocket"
          ? t.rocketInstructions
          : method.id === "card"
            ? "Secure card payment processing"
            : t.offlineInstructions,
  }));

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "bkash":
      case "rocket":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Secure Payment Process</p>
                  <p>
                    You will be redirected to{" "}
                    {paymentMethod === "bkash" ? "bKash" : "Rocket"} secure
                    payment page. We do not store your PIN or financial
                    information.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">
                  {t.mobileNumber} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobile"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    setMobileError("");
                  }}
                  placeholder="+880 1XXXXXXXXX"
                  className={mobileError ? "border-red-500" : ""}
                />
                {mobileError && (
                  <p className="text-red-500 text-sm">{mobileError}</p>
                )}
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handlePaymentSubmit}
                disabled={isProcessingPayment || !mobileNumber}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Pay with {paymentMethod === "bkash" ? "bKash" : "Rocket"}
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case "card":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">
                    Secure SSL Encrypted Payment
                  </p>
                  <p>
                    Your card details are processed securely through our payment
                    gateway. We do not store your card information.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">
                {t.cardNumber} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardNumber"
                value={cardData.number}
                onChange={(e) =>
                  setCardData((prev) => ({ ...prev, number: e.target.value }))
                }
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">
                  {t.expiryDate} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expiry"
                  value={cardData.expiry}
                  onChange={(e) =>
                    setCardData((prev) => ({ ...prev, expiry: e.target.value }))
                  }
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">
                  {t.cvv} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cvv"
                  value={cardData.cvv}
                  onChange={(e) =>
                    setCardData((prev) => ({ ...prev, cvv: e.target.value }))
                  }
                  placeholder="123"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardHolder">
                {t.cardHolderName} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardHolder"
                value={cardData.holderName}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    holderName: e.target.value,
                  }))
                }
                placeholder="John Doe"
              />
            </div>
            <Button
              className="w-full bg-deep-plum hover:bg-accent-purple"
              onClick={handlePaymentSubmit}
              disabled={
                isProcessingPayment ||
                !cardData.number ||
                !cardData.expiry ||
                !cardData.cvv ||
                !cardData.holderName
              }
            >
              {isProcessingPayment ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Pay Securely
                </>
              )}
            </Button>
          </div>
        );

      case "offline":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{t.offlineInstructions}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transactionId">{t.transactionId}</Label>
                <Input id="transactionId" placeholder="Enter transaction ID" />
              </div>
              <div className="space-y-2">
                <Label>{t.payslipUpload}</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent-purple transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click or drag payslip here
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
              <Button className="w-full bg-deep-plum hover:bg-accent-purple">
                {t.uploadPayslip}
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Select a payment method to continue
          </div>
        );
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/academic-history"
            className="inline-flex items-center text-accent-purple hover:text-deep-plum mb-4"
          >
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
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === "en"
                    ? "bg-deep-plum text-white"
                    : "text-gray-600 hover:text-deep-plum"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("bn")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === "bn"
                    ? "bg-deep-plum text-white"
                    : "text-gray-600 hover:text-deep-plum"
                }`}
              >
                BN
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Review Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review Application */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t.reviewApplication}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviewSections.map((section) => (
                  <Collapsible
                    key={section.id}
                    open={expandedSections[section.id]}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-deep-plum text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {section.step}
                          </div>
                          <span className="font-semibold text-deep-plum">
                            {section.title}
                          </span>
                          <Badge
                            className={
                              section.status === "complete"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {section.status === "complete"
                              ? t.complete
                              : t.incomplete}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            {t.edit}
                          </Button>
                          {expandedSections[section.id] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 bg-gray-50 border-x border-b rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(section.content).map(
                            ([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600">{key}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t.paymentMethods}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  {availablePaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label
                          htmlFor={method.id}
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          {method.icon}
                          <div>
                            <div className="font-medium">
                              {method.displayName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {method.description}
                            </div>
                          </div>
                        </Label>
                        {method.testMode && (
                          <Badge variant="outline" className="text-xs">
                            Demo
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {/* Payment Form */}
                {paymentMethod && (
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-deep-plum mb-4">
                      {t.paymentDetails}
                    </h4>
                    {renderPaymentForm()}
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-6 text-center">
                  <Button
                    size="lg"
                    className="bg-deep-plum hover:bg-accent-purple px-8"
                    disabled={!paymentMethod}
                    asChild
                  >
                    <Link to="/dashboard">{t.submitApplication}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Fee Summary */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-deep-plum text-white">
                <CardTitle className="font-poppins">{t.totalAmount}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admission Fee</span>
                    <span className="font-semibold">BDT 15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course Fee</span>
                    <span className="font-semibold">BDT 45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lab Fee</span>
                    <span className="font-semibold">BDT 8,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Others</span>
                    <span className="font-semibold">BDT 5,000</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">BDT 73,000</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Waiver (25%)</span>
                    <span className="font-semibold">-BDT 18,250</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-lg font-bold">
                    <span className="text-deep-plum">Total</span>
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
