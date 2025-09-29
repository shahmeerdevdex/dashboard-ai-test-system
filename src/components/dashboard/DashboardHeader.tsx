import { Bell, MapPin, Search, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="h-20 border-b border-white/20 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* <div className="w-12 h-12 flex items-center justify-center">
            <img
              src="/punjab-logo-png-transparent.png"
              alt="Punjab Traffic Police"
              className="w-8 h-8 object-contain"
            />
          </div> */}
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Punjab Traffic Police
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              AI-Powered Driving Test Administration System
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm px-3 py-2 bg-green-50 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-semibold">System Online</span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Admin Dashboard</span>
          </div>
        </div>

        {/* <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 rounded-xl">
          <Bell className="w-4 h-4 text-gray-600" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 rounded-full">
            3
          </Badge>
        </Button> */}

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl px-4 py-2">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
