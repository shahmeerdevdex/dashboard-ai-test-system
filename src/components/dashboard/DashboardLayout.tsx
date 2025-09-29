import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardLayout() {
  return (
    <div className="min-h-screen w-full bg-background">
      <DashboardHeader />
      <main className="flex-1 p-6 bg-background">
        <Outlet />
      </main>
    </div>
  );
}
