import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Key,
  User,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";

export default function ApplicationSuccess() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const trackingId = searchParams.get("trackingId");

  // Generate applicant credentials (in real implementation, this would come from the API)
  const applicantId = trackingId ? `APP${trackingId.slice(-6)}` : "APP123456";
  const temporaryPassword = "temp123456"; // Fixed password for demo - in production this would be randomly generated and stored

  const texts = {
    en: {
      title: "Application Submitted Successfully!",
      subtitle: "Your application has been received and is under review",
      congratulations: "Congratulations!",
      applicationSubmitted:
        "Your application has been successfully submitted to Northern University Bangladesh.",
      importantInfo: "Important Information",
      trackingId: "Application Tracking ID",
      applicantId: "Applicant ID",
      temporaryPassword: "Temporary Password",
      nextSteps: "Next Steps",
      step1: "Login to Applicant Portal",
      step1Desc:
        "Use your Applicant ID and temporary password to access the applicant portal",
      step2: "Complete Payment",
      step2Desc: "Upload your payment receipt and complete the payment process",
      step3: "Upload Documents",
      step3Desc: "Upload all required academic and personal documents",
      step4: "Track Application Status",
      step4Desc: "Monitor your application progress and admin decisions",
      loginPortal: "Login to Applicant Portal",
      downloadInfo: "Download Application Info",
      copyCredentials: "Copy Credentials",
      saveInfo: "Save This Information",
      saveInfoDesc:
        "Please save your Applicant ID and password. You will need them to access the applicant portal.",
      adminReview: "Admin Review Process",
      adminReviewDesc:
        "Your application will be reviewed by our admissions team. You will be notified of any updates via email and SMS.",
      supportInfo: "Need Help?",
      supportDesc:
        "If you have any questions, please contact our admissions office.",
      contactEmail: "Email: admission@nu.edu.bd",
      contactPhone: "Phone: +880 1700-000000",
      credentialsCopied: "Credentials copied to clipboard!",
      trackingCopied: "Tracking ID copied to clipboard!",
    },
    bn: {
      title: "আবেদন সফলভাবে জ��া দেওয়া হয়েছে!",
      subtitle: "আপনার আবেদন গ্রহণ করা হয়েছে এবং পর্যালোচনাধীন রয়েছে",
      congratulations: "অভিনন্দন!",
      applicationSubmitted:
        "আপনার আবেদন সফলভাবে নর্দার্ন ইউনিভার্সিটি বাংলাদেশে জমা দেওয়া হয়েছে।",
      importantInfo: "গুরুত্বপূর্ণ তথ্য",
      applicantId: "আবেদন��ারী আইডি",
      temporaryPassword: "অস্থায়ী পাসওয়ার্ড",
      nextSteps: "পরবর্তী ধাপসমূহ",
      step1: "আবেদনকারী পোর্টালে লগইন",
      step1Desc:
        "আবেদনকারী পোর্টাল অ���যাক্সেস করতে আপনার আবেদনকারী আইডি এবং অস্থায়ী পাসওয়ার্ড ব্যবহার করুন",
      step2: "পেমেন্ট সম্পূর্ণ করুন",
      step2Desc:
        "আপনার পেমেন্ট রসিদ আপ���োড করুন এবং পেমেন্ট প্রক্রিয়া সম্পূর্ণ করুন",
      step3: "ডকুমেন্ট আপলোড করুন",
      step3Desc: "সমস্ত প্রয়োজনীয় একাডেমি��� এবং ব্যক্তিগত নথি আপলোড করুন",
      step4: "আবেদনের স্থিতি ট্র্যাক করুন",
      step4Desc:
        "আপনার আবেদনের অগ্রগতি এবং প্রশাসনিক সিদ্ধান্ত পর্যবেক্ষণ করুন",
      loginPortal: "আবেদনকারী পোর্টালে লগইন",
      downloadInfo: "আবেদনের তথ্য ডাউনলোড করুন",
      copyCredentials: "পরিচয়পত্র কপি করুন",
      saveInfo: "এই তথ্য সংরক্ষণ করুন",
      saveInfoDesc:
        "অনুগ্রহ করে আপনার আবেদনকারী আইডি এবং পাসওয়ার্ড সংরক্ষণ করুন। আবেদনকারী পোর্টাল অ্যাক্সেস করতে আপনার এগুলি প্রয়োজন হবে।",
      adminReview: "প্রশাসনিক পর্যালোচনা প্রক্রিয়া",
      adminReviewDesc:
        "আপনার আবেদন আমাদের ভর্তি দল দ্বারা পর্যালোচনা কর�� হবে। যেকোনো আপডেটের জন্য আপনাকে ইমেইল এবং এসএমএসের মাধ্যমে অবহিত করা হবে।",
      supportInfo: "সাহায্য প্রয়োজন?",
      supportDesc:
        "যদি আপনার কোন প্রশ��ন থাকে, অনুগ্রহ করে আমাদের ভর্তি অফিসের সাথে যোগাযোগ করুন।",
      contactEmail: "ইমেইল: admission@nu.edu.bd",
      contactPhone: "ফোন: +৮৮০ ১৭০০-০০০০০০",
      credentialsCopied: "পরিচয়পত্র ক্লিপবোর্ডে কপি করা হয়েছে!",
      trackingCopied: "ট্র্যাকিং আইডি ক্লিপবোর্ডে কপি করা হয়েছে!",
    },
  };

  const t = texts[language];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description:
          type === "credentials" ? t.credentialsCopied : t.trackingCopied,
      });
    });
  };

  const downloadApplicationInfo = () => {
    const info = `
Northern University Bangladesh
Application Information

Applicant ID: ${applicantId}
Temporary Password: ${temporaryPassword}

Next Steps:
1. Login to Applicant Portal using your credentials
2. Complete payment process
3. Upload required documents
4. Track your application status

Contact Information:
Email: admission@nu.edu.bd
Phone: +880 1700-000000

Please keep this information safe and secure.
    `;

    const blob = new Blob([info], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Application_${applicantId}_Info.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {t.title}
              </h1>
            </div>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className={`px-3 py-1 text-sm rounded ${
                language === "en"
                  ? "bg-deep-plum text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className={`px-3 py-1 text-sm rounded ${
                language === "bn"
                  ? "bg-deep-plum text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              BN
            </button>
          </div>
        </div>

        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">
                  {t.congratulations}
                </h3>
                <p className="text-green-700">{t.applicationSubmitted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {t.importantInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4 text-center">
                  <User className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm text-gray-600 mb-1">{t.applicantId}</p>
                  <p className="font-mono font-bold text-lg">{applicantId}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `${applicantId}:${temporaryPassword}`,
                        "credentials",
                      )
                    }
                    className="mt-2"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4 text-center">
                  <Key className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm text-gray-600 mb-1">
                    {t.temporaryPassword}
                  </p>
                  <p className="font-mono font-bold text-lg">
                    {temporaryPassword}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(temporaryPassword, "credentials")
                    }
                    className="mt-2"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>{t.saveInfo}:</strong> {t.saveInfoDesc}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-poppins text-deep-plum">
              {t.nextSteps}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-800 text-sm font-semibold">
                    1
                  </Badge>
                  <div>
                    <h4 className="font-semibold">{t.step1}</h4>
                    <p className="text-sm text-gray-600">{t.step1Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="bg-green-100 text-green-800 text-sm font-semibold">
                    2
                  </Badge>
                  <div>
                    <h4 className="font-semibold">{t.step2}</h4>
                    <p className="text-sm text-gray-600">{t.step2Desc}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="bg-purple-100 text-purple-800 text-sm font-semibold">
                    3
                  </Badge>
                  <div>
                    <h4 className="font-semibold">{t.step3}</h4>
                    <p className="text-sm text-gray-600">{t.step3Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="bg-orange-100 text-orange-800 text-sm font-semibold">
                    4
                  </Badge>
                  <div>
                    <h4 className="font-semibold">{t.step4}</h4>
                    <p className="text-sm text-gray-600">{t.step4Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Review Info */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-poppins text-deep-plum">
              {t.adminReview}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{t.adminReviewDesc}</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                {t.supportInfo}
              </h4>
              <p className="text-blue-700 text-sm mb-2">{t.supportDesc}</p>
              <div className="space-y-1 text-sm">
                <p className="text-blue-700">{t.contactEmail}</p>
                <p className="text-blue-700">{t.contactPhone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/applicant-portal">
            <Button className="w-full sm:w-auto bg-deep-plum hover:bg-accent-purple">
              <ExternalLink className="w-4 h-4 mr-2" />
              {t.loginPortal}
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={downloadApplicationInfo}
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.downloadInfo}
          </Button>

          <Link to="/">
            <Button variant="ghost" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
