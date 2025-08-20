import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";
import { useApplication } from "../contexts/ApplicationContext";

interface HeaderProps {
  showLogin?: boolean;
}

export default function Header({ showLogin = false }: HeaderProps) {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const navigate = useNavigate();

  // Try to get auth context, but don't fail if it's not available
  let user = null;
  let logout = () => {};
  let userType = null;

  try {
    const auth = useAuth();
    user = auth.user;
    logout = auth.logout;
    userType = auth.userType;
  } catch {
    // Auth context not available (applicant app)
  }

  // Try to get application context for clearing form data
  let clearApplicationData = () => {};
  try {
    const app = useApplication();
    clearApplicationData = app.clearApplicationData;
  } catch {
    // Application context not available
  }

  const handleNewApplication = () => {
    // Clear all form data
    clearApplicationData();

    // Clear localStorage completely
    localStorage.removeItem("nu_application_draft");
    localStorage.removeItem("nu_user_session");
    localStorage.removeItem("nu_form_cache");

    // Navigate to program selection with new=true parameter
    navigate("/program-selection?new=true");

    // Force page reload to ensure clean state
    window.location.reload();
  };

  const texts = {
    en: {
      login: "Login",
      logout: "Logout",
      profile: "Profile",
      universityName: "Northern University Bangladesh",
      newApplication: "New Application",
    },
    bn: {
      login: "লগইন",
      logout: "লগআউট",
      profile: "প্রোফাইল",
      universityName: "নর্দার্ন ইউনিভার্সিটি বাংলাদেশ",
      newApplication: "নতুন আবেদন",
    },
  };

  const t = texts[language];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-deep-plum rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">NU</span>
            </div>
            <div className="font-poppins font-semibold text-deep-plum text-lg">
              {t.universityName}
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* New Application Button */}
            <Button
              onClick={handleNewApplication}
              variant="outline"
              size="sm"
              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t.newApplication}
            </Button>

            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === "en"
                    ? "bg-white text-deep-plum shadow-sm"
                    : "text-gray-600 hover:text-deep-plum"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("bn")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === "bn"
                    ? "bg-white text-deep-plum shadow-sm"
                    : "text-gray-600 hover:text-deep-plum"
                }`}
              >
                BN
              </button>
            </div>

            {/* User Info or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-deep-plum text-deep-plum hover:bg-deep-plum hover:text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.type === "applicant"
                        ? user.universityId
                        : user.email}
                    </p>
                    <p className="text-xs text-gray-500">{user.department}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : showLogin ? (
              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                >
                  <a href="/registration">Registration System</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-deep-plum text-deep-plum hover:bg-deep-plum hover:text-white"
                >
                  <a href="/applicant-portal">Applicant Portal</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-deep-plum text-deep-plum hover:bg-deep-plum hover:text-white"
                >
                  <a href="/admin">Admin Portal</a>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
