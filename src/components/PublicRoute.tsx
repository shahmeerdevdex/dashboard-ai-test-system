import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRouteComponent: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("🌐 PublicRoute - User:", user, "Loading:", loading);

  // Show loading state while checking authentication
  if (loading) {
    console.log("⏳ PublicRoute - Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (user) {
    console.log("✅ PublicRoute - User authenticated, redirecting to dashboard");
    return <Navigate to="/" replace />;
  }

  // Render children if not authenticated
  console.log("🌐 PublicRoute - No user, rendering login/register");
  return <>{children}</>;
};

// Memoize the component to prevent unnecessary re-renders
export const PublicRoute = memo(PublicRouteComponent);
