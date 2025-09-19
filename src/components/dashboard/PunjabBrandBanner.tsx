import { MapPin } from "lucide-react";

export function PunjabBrandBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 p-4 rounded-lg text-gray-800 shadow-md mb-4 border border-gray-200">
      <div className="absolute inset-0 bg-white/20"></div>
      <div className="relative flex items-center justify-between">
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
            <div className="flex items-center gap-1 mt-0.5 text-gray-600">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">Government of Punjab, Pakistan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-blue-100/30 rounded-full"></div>
      <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-green-100/20 rounded-full"></div>
    </div>
  );
}
