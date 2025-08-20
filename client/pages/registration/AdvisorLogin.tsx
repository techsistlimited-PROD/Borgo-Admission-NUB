import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, Lock, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";

export default function AdvisorLogin() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const texts = {
    en: {
      title: "Advisor/Teacher Login",
      subtitle: "Access your advising portal",
      employeeId: "Employee ID",
      password: "Password",
      login: "Login",
      forgotPassword: "Forgot Password?",
      backToHome: "Back to Home",
      loggingIn: "Logging in...",
      employeeIdPlaceholder: "Enter your Employee ID",
      passwordPlaceholder: "Enter your password",
      invalidCredentials: "Invalid Employee ID or Password",
      loginSuccess: "Login successful! Redirecting...",
      demoCredentials: "Demo Credentials",
      demoEmployeeId: "Employee ID: ADV001",
      demoPassword: "Password: advisor123",
    },
    bn: {
      title: "পরামর্শদাতা/শিক্ষক লগইন",
      subtitle: "আপনার পরামর্শ পোর্টালে প্রবেশ করুন",
      employeeId: "কর্মচারী আইডি",
      password: "পাসওয়ার্ড",
      login: "লগইন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      backToHome: "হোমে ফিরুন",
      loggingIn: "লগইন হচ্ছে...",
      employeeIdPlaceholder: "আপনার কর্মচারী আইডি দিন",
      passwordPlaceholder: "আপনার পাসওয়ার্ড দিন",
      invalidCredentials: "ভুল কর্মচারী আইডি বা পাসওয়ার্ড",
      loginSuccess: "লগইন সফল! রিডাইরেক্ট হচ্ছে...",
      demoCredentials: "ডেমো তথ্য",
      demoEmployeeId: "কর্মচারী আইডি: ADV001",
      demoPassword: "পাসওয়ার্ড: advisor123",
    },
  };

  const t = texts[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Demo login logic
      if (formData.employeeId === "ADV001" && formData.password === "advisor123") {
        toast({
          title: "Success",
          description: t.loginSuccess,
        });
        
        // Store login info
        localStorage.setItem("reg_user_type", "advisor");
        localStorage.setItem("reg_user_data", JSON.stringify({
          employeeId: formData.employeeId,
          name: "Dr. Jane Smith",
          department: "Computer Science and Engineering",
          designation: "Associate Professor",
          assignedStudents: 45
        }));
        
        navigate("/registration/advisor-dashboard");
      } else {
        toast({
          title: "Error",
          description: t.invalidCredentials,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lavender-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/registration"
          className="inline-flex items-center text-deep-plum hover:text-accent-purple mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.backToHome}
        </Link>

        <Card className="bg-white shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-poppins text-deep-plum">
                {t.title}
              </CardTitle>
              <p className="text-gray-600 mt-2">{t.subtitle}</p>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    language === "en"
                      ? "bg-white text-deep-plum shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("bn")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    language === "bn"
                      ? "bg-white text-deep-plum shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  BN
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">{t.employeeId}</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder={t.employeeIdPlaceholder}
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? t.loggingIn : t.login}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/registration/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                {t.forgotPassword}
              </Link>
            </div>

            {/* Demo Credentials */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-800 mb-2">{t.demoCredentials}</h4>
                <div className="text-sm text-purple-700 space-y-1">
                  <p>{t.demoEmployeeId}</p>
                  <p>{t.demoPassword}</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
