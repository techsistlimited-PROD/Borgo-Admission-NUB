import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Settings, Lock, ArrowLeft } from "lucide-react";
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

export default function AdminLogin() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const texts = {
    en: {
      title: "Admin/ACAD Login",
      subtitle: "Access your administrative portal",
      username: "Username",
      password: "Password",
      login: "Login",
      forgotPassword: "Forgot Password?",
      backToHome: "Back to Home",
      loggingIn: "Logging in...",
      usernamePlaceholder: "Enter your username",
      passwordPlaceholder: "Enter your password",
      invalidCredentials: "Invalid Username or Password",
      loginSuccess: "Login successful! Redirecting...",
      demoCredentials: "Demo Credentials",
      demoUsername: "Username: admin",
      demoPassword: "Password: admin123",
    },
    bn: {
      title: "অ্যাডমিন/ACAD লগইন",
      subtitle: "আপনার প্রশাসনিক পোর্টালে প্রবেশ করুন",
      username: "ব্যবহারকারীর নাম",
      password: "পাসওয়ার্ড",
      login: "লগইন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      backToHome: "হোমে ফিরুন",
      loggingIn: "লগইন হচ্ছে...",
      usernamePlaceholder: "আপনার ব্যবহারকারীর নাম দিন",
      passwordPlaceholder: "আপ��ার পাসওয়ার্ড দিন",
      invalidCredentials: "ভুল ব্যবহারকারীর নাম বা পাসওয়ার্ড",
      loginSuccess: "লগইন সফল! রিডাইরেক্ট হচ্ছে...",
      demoCredentials: "ডেমো তথ্য",
      demoUsername: "ব্যবহারকারীর নাম: admin",
      demoPassword: "পাসওয়ার্ড: admin123",
    },
  };

  const t = texts[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Demo login logic
      if (formData.username === "admin" && formData.password === "admin123") {
        toast({
          title: "Success",
          description: t.loginSuccess,
        });
        
        // Store login info
        localStorage.setItem("reg_user_type", "admin");
        localStorage.setItem("reg_user_data", JSON.stringify({
          username: formData.username,
          name: "System Administrator",
          role: "ACAD Manager",
          department: "Academic Administration",
          permissions: ["full_access"]
        }));
        
        navigate("/registration/admin-dashboard");
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
            <div className="w-16 h-16 bg-gradient-to-r from-deep-plum to-accent-purple rounded-lg flex items-center justify-center mx-auto">
              <Settings className="w-8 h-8 text-white" />
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
                <Label htmlFor="username">{t.username}</Label>
                <div className="relative">
                  <Settings className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder={t.usernamePlaceholder}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
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
                className="w-full bg-gradient-to-r from-deep-plum to-accent-purple hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? t.loggingIn : t.login}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/registration/forgot-password"
                className="text-sm text-deep-plum hover:text-accent-purple transition-colors"
              >
                {t.forgotPassword}
              </Link>
            </div>

            {/* Demo Credentials */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-deep-plum mb-2">{t.demoCredentials}</h4>
                <div className="text-sm text-deep-plum space-y-1">
                  <p>{t.demoUsername}</p>
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
