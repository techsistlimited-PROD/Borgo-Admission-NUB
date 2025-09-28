import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth, getDemoCredentials } from "@/contexts/AuthContext";

export default function AdmissionOfficerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, setRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsSubmitting(false);
      return;
    }

    const success = await login({ identifier: email, password, type: "admin" });
    if (success) {
      // Ensure role is set to admission_officer
      setRole("admission_officer");
      navigate("/admin/admissions");
    } else {
      setError("Invalid email or password. Please try again.");
    }

    setIsSubmitting(false);
  };

  const loadDemoCredentials = () => {
    // use getDemoCredentials if available
    try {
      const demo = getDemoCredentials();
      if (demo && demo.admin) {
        setEmail(demo.admin.email || "admission@nu.edu.bd");
        setPassword(demo.admin.password || "admin123");
      } else {
        setEmail("admission@nu.edu.bd");
        setPassword("admission123");
      }
    } catch {
      setEmail("admission@nu.edu.bd");
      setPassword("admission123");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-plum via-accent-purple to-pink-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-deep-plum font-poppins">Admission Officer Login</CardTitle>
              <p className="text-gray-600 mt-2">Secure access for admission officers</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="border-purple-200 bg-purple-50">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Demo credentials available</span>
                  <Button variant="outline" size="sm" onClick={loadDemoCredentials} className="text-xs border-purple-300 text-purple-700 hover:bg-purple-100">Load Demo</Button>
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="admission@nu.edu.bd" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password" />
                  <Button type="button" variant="ghost" size="sm" onClick={()=>setShowPassword(!showPassword)} className="absolute right-0 top-0 h-full px-3 hover:bg-transparent">
                    {showPassword? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50"><AlertCircle className="w-4 h-4 text-red-600" /><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>
              )}

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-800" disabled={isSubmitting}>
                {isSubmitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Logging in...</>) : (<><LogIn className="w-4 h-4 mr-2" />Login to Admission Panel</>)}
              </Button>
            </form>

            <div className="border-t pt-4">
              <div className="text-center"><Link to="/admin" className="text-sm text-gray-600 hover:text-deep-plum">← Admin Login</Link></div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center"><p className="text-sm text-white/80">Contact IT support if you're having trouble accessing your account.</p></div>
      </div>
    </div>
  );
}
