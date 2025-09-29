import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PunjabBrandBanner } from "@/components/dashboard/PunjabBrandBanner";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, AlertCircle } from "lucide-react";
import { trafficSigns } from "@/data/trafficSigns";

export default function LoginPage() {
  const [cnicId, setCnicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { signInWithCNIC } = useAuth();
  const navigate = useNavigate();

  const formatCNIC = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format as XXXXX-XXXXXXX-X
    if (digits.length <= 5) {
      return digits;
    } else if (digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cnicId") {
      // Format CNIC as user types
      const formattedValue = formatCNIC(value);
      setCnicId(formattedValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signInWithCNIC(cnicId);

      console.log("login result", result);

      if (result.success) {
        setSuccess("Login successful!");
        // Redirect immediately without delay
        navigate("/", { replace: true });
      } else {
        setError(result.error || "An error occurred");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Traffic Signs Background */}
      <div className="absolute inset-0 pointer-events-none w-[60%] mx-auto">
        {trafficSigns.map((sign, index) => (
          <img
            key={index}
            src={sign.image}
            alt="Traffic sign"
            className={`absolute ${sign.position} ${sign.size} ${sign.rotation} opacity-30 transition-opacity duration-300 object-contain`}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden backdrop-blur-sm">
          {/* Header with Logo and Branding */}
          <div className="text-center pt-8 pb-6 px-8">
            <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src="/punjab-logo-png-transparent.png"
                alt="Punjab Traffic Police"
                className="w-28 h-28 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Punjab Traffic Police</h1>
            <p className="text-gray-600 text-sm">
              AI-Powered Driving Test
              <span className="block text-blue-600 font-medium">Administration System</span>
            </p>
          </div>

          {/* Login Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cnic" className="text-gray-700 text-sm font-medium">
                  CNIC Number
                </Label>
                <Input
                  id="cnic"
                  name="cnicId"
                  type="text"
                  placeholder="XXXXX-XXXXXXX-X"
                  value={cnicId}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                disabled={loading || !cnicId.trim()}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
