import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IdCard,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth, getDemoCredentials } from "../contexts/AuthContext";

export default function ApplicantLogin() {
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!universityId || !password) {
      setError("Please enter both University ID and password");
      setIsSubmitting(false);
      return;
    }

    const success = await login({
      identifier: universityId,
      password,
      type: "applicant",
    });

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid University ID or password. Please try again.");
    }

    setIsSubmitting(false);
  };

  const loadDemoCredentials = () => {
    // For testing purposes - in production, remove this function
    setUniversityId("NU24BCS001");
    setPassword("temp123456");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-bg to-mint-green flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-deep-plum rounded-full flex items-center justify-center">
              <IdCard className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-deep-plum font-poppins">
                Applicant Portal Login
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Enter your University ID and temporary password
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Demo Credentials Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Demo credentials available</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadDemoCredentials}
                    className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Load Demo
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="universityId">Applicant ID</Label>
                <Input
                  id="universityId"
                  type="text"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  placeholder="e.g., APP123456"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your temporary password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-deep-plum hover:bg-accent-purple"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login to Applicant Portal
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have credentials yet?
              </p>
              <Link
                to="/"
                className="text-accent-purple hover:text-deep-plum text-sm font-medium"
              >
                Apply for Admission
              </Link>
            </div>

            <div className="border-t pt-4">
              <div className="text-center">
                <Link
                  to="/admin-login"
                  className="text-sm text-gray-600 hover:text-deep-plum"
                >
                  Admin Login →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Your University ID and temporary password are sent via SMS/Email
            after admission approval.
          </p>
        </div>
      </div>
    </div>
  );
}
