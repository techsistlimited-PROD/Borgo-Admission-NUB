import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-lavender-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-deep-plum font-poppins mb-2">
            404
          </CardTitle>
          <h2 className="text-xl font-semibold text-accent-purple">
            Page Not Found
          </h2>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full bg-deep-plum hover:bg-accent-purple">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white">
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
