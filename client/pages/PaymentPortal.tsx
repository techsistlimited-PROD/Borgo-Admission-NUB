import { useState } from "react";
import {
  Upload,
  CreditCard,
  Smartphone,
  Building,
  FileText,
  AlertTriangle,
  ExternalLink,
  Check,
  DollarSign,
  Clock,
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
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";

export default function PaymentPortal() {
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
  const [payslipFile, setPayslipFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");

  const texts = {
    en: {
      title: "Payment Portal",
      subtitle: "Complete your admission payment",
      paymentMethods: "Payment Methods",
      paymentDetails: "Payment Details",
      applicationSummary: "Application Summary",
      paymentStatus: "Payment Status",
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
      applicationInfo: "Application Information",
      trackingId: "Tracking ID",
      program: "Program",
      department: "Department",
      semester: "Semester",
      paymentRequired: "Payment Required",
      paymentPending: "Payment Pending",
      paymentCompleted: "Payment Completed",
      awaitingVerification: "Awaiting Verification",
      paymentInstructionsTitle: "How to Pay",
      stepByStepGuide: "Step-by-step Payment Guide",
      selectPaymentMethod: "Select your preferred payment method",
      enterDetails: "Enter required payment details",
      completePayment: "Complete the payment process",
      uploadReceipt: "Upload payment receipt for verification",
      verificationNote: "Verification usually takes 1-2 business days",
    },
    bn: {
      title: "পেমেন্ট পোর্টাল",
      subtitle: "আপনার ভর্তি পেমেন্ট সম্পন্ন করুন",
      paymentMethods: "পেমেন্ট পদ্ধতি",
      paymentDetails: "পেমেন্ট বিবরণ",
      applicationSummary: "আবেদনের সারসংক্ষেপ",
      paymentStatus: "পেমেন্ট অবস্থা",
      bkash: "বিকাশ",
      rocket: "রকেট",
      card: "ক্রেডিট/ডেবিট কার্ড",
      offline: "অফলাইন পেমেন্ট",
      payslipUpload: "পে-স্লিপ আপলোড করুন",
      transactionId: "লেনদেন আইডি",
      cardNumber: "কার্ড নাম্বার",
      expiryDate: "মেয়াদ শেষের তারিখ",
      cvv: "সিভিভি",
      cardHolderName: "কার্ডধারীর নাম",
      mobileNumber: "মোবাইল নাম্বার",
      payNow: "এখনই পেমেন্ট করুন",
      uploadPayslip: "পে-স্লিপ আপলোড করুন",
      paymentInstructions: "পেমেন্ট নির্দেশাবলী",
      bkashInstructions:
        "এই নাম্বারে টাকা পাঠান: ০১৭০০০০০০০০ এবং লেনদেনের রসিদ আপলোড করুন",
      rocketInstructions:
        "এই নাম্বারে টাকা পাঠান: ০১৭০০০০০০০০০ এবং লেনদেনের রসিদ আপলোড করুন",
      offlineInstructions:
        "বিশ্ববিদ্যালয়ের ক্যাশ কাউন্টারে পেমেন্ট করুন এবং রসিদ আপলোড করুন",
      totalAmount: "মোট পরিমাণ",
      applicationInfo: "আবেদনের তথ্য",
      trackingId: "ট্র্যাকিং আইডি",
      program: "প্রোগ্রাম",
      department: "বিভাগ",
      semester: "সেমিস্টার",
      paymentRequired: "পেমেন্ট প্রয়োজন",
      paymentPending: "পেমেন্ট অপেক্ষমাণ",
      paymentCompleted: "পেমেন্ট সম্পন্ন",
      awaitingVerification: "যাচাইকরণের অপেক্ষায়",
      paymentInstructionsTitle: "কিভাবে পে���েন্ট করবেন",
      stepByStepGuide: "ধাপে ধাপে পেমেন্ট গাইড",
      selectPaymentMethod: "আপনার পছন্দের পেমেন্ট পদ্ধতি নির্বাচন করুন",
      enterDetails: "প্রয়োজনীয় পেমেন্ট বিবরণ লিখুন",
      completePayment: "পেমেন্ট প্রক্রিয়া সম্পন্ন করুন",
      uploadReceipt: "যাচাইকরণের জন্য পেমেন্ট রসিদ আপলোড করুন",
      verificationNote: "যাচাইকরণে সাধারণত ১-২ কার্যদিবস লাগে",
    },
  };

  const t = texts[language];

  // Mock application data - in real app this would come from context/API
  const applicationData = {
    trackingId: "NU2024001234",
    program: "BSc in Computer Science",
    department: "Computer Science & Engineering",
    semester: "Spring 2024",
    campus: "Main Campus",
    totalAmount: 54750,
    paymentStatus: "pending", // pending, paid, verified
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
        amount: applicationData.totalAmount,
        currency: "BDT",
        applicationId: applicationData.trackingId,
        userId: "user123",
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
          window.open(
            redirectUrl,
            "_blank",
            "width=800,height=600,scrollbars=yes,resizable=yes",
          );
          break;

        case "rocket":
          if (!validateMobileNumber(mobileNumber, "rocket")) return;
          redirectUrl = await paymentService.initiateRocketPayment(
            paymentConfig,
            mobileNumber,
          );
          window.open(
            redirectUrl,
            "_blank",
            "width=800,height=600,scrollbars=yes,resizable=yes",
          );
          break;

        case "card":
          redirectUrl = await paymentService.initiateCardPayment(
            paymentConfig,
            cardData,
          );
          window.open(
            redirectUrl,
            "_blank",
            "width=800,height=600,scrollbars=yes,resizable=yes",
          );
          break;

        case "offline":
          // Handle offline payment submission
          alert("Payslip uploaded successfully. Awaiting verification.");
          break;

        default:
          throw new Error("Invalid payment method");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {t.paymentRequired}
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {t.awaitingVerification}
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            {t.paymentCompleted}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            {t.paymentPending}
          </Badge>
        );
    }
  };

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
                    payment page.
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
                  <p>Your card details are processed securely.</p>
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
                <Input 
                  id="transactionId" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID" 
                />
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPayslipFile(file);
                      }
                    }}
                  />
                  {payslipFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {payslipFile.name}
                    </p>
                  )}
                </div>
              </div>
              <Button 
                className="w-full bg-deep-plum hover:bg-accent-purple"
                onClick={handlePaymentSubmit}
                disabled={!payslipFile || !transactionId}
              >
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

        {/* Payment Status Alert */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <AlertTriangle className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>{t.paymentStatus}:</strong> {getPaymentStatusBadge(applicationData.paymentStatus)}
            <span className="ml-2">{t.verificationNote}</span>
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Summary */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t.applicationInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">{t.trackingId}:</span>
                    <span className="font-medium ml-2">{applicationData.trackingId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t.program}:</span>
                    <span className="font-medium ml-2">{applicationData.program}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t.department}:</span>
                    <span className="font-medium ml-2">{applicationData.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t.semester}:</span>
                    <span className="font-medium ml-2">{applicationData.semester}</span>
                  </div>
                </div>
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
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Fee Summary */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-deep-plum text-white">
                <CardTitle className="font-poppins flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {t.totalAmount}
                </CardTitle>
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
                    <span className="text-accent-purple">BDT {applicationData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card className="bg-white shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum">
                  {t.paymentInstructionsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-deep-plum text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <p>{t.selectPaymentMethod}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-deep-plum text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <p>{t.enterDetails}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-deep-plum text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <p>{t.completePayment}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-deep-plum text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <p>{t.uploadReceipt}</p>
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
