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
    <header className="h-20 border-b bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-300 shadow-sm">
            <img
              src="/punjab-logo-png-transparent.png"
              alt="Punjab Traffic Police"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Punjab Traffic Police</h1>
            <p className="text-sm text-gray-700 font-medium">
              AI-Powered Driving Test Administration System
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 font-medium">System Online</span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Punjab Traffic Police</span>
          </div>
        </div>


        <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
          <Bell className="w-4 h-4 text-gray-600" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500">
            3
          </Badge>
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="hover:bg-red-50 text-red-600 hover:text-red-700">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
