import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  UserCheck,
  Clock,
  FileText,
  Settings,
  Car,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Recent Tests", url: "/", icon: LayoutDashboard },
  // { title: "Live Tests", url: "/live-tests", icon: Clock },
  // { title: "Test Results", url: "/test-results", icon: ClipboardCheck },
  { title: "Users", url: "/users", icon: Users },
  // { title: "Retest Approvals", url: "/approvals", icon: UserCheck },
  // { title: "Reports", url: "/reports", icon: FileText },
  // { title: "Settings", url: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const isActive = (path: string) => currentPath === path;

  const handleItemClick = (itemUrl: string) => {
    // If clicking the same item, collapse it
    if (expandedItem === itemUrl) {
      setExpandedItem(null);
    } else {
      // Otherwise, expand this item (collapsing any other)
      setExpandedItem(itemUrl);
    }
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent className="bg-white/95 backdrop-blur-md border-r border-white/20 shadow-xl">
        {/* Logo Section */}
        <div className="p-6 border-b bg-gradient-to-br from-blue-50/50 to-green-50/50">
          <div className="">
            <div className="mx-auto w-20 h-20 flex items-center justify-center">
              <img
                src="/punjab-logo-png-transparent.png"
                alt="Punjab Traffic Police"
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-semibold text-sm uppercase tracking-wider px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2 py-2">
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="group">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    onClick={() => handleItemClick(item.url)}
                    className={`
                      transition-all duration-300 ease-in-out rounded-xl mx-2
                      ${
                        isActive(item.url)
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl border-l-4 border-blue-300 transform scale-[1.02] font-bold ring-2 ring-blue-200"
                          : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-lg hover:border-l-4 hover:border-blue-200 hover:transform hover:scale-[1.01] hover:ring-1 hover:ring-blue-100"
                      }
                      ${
                        expandedItem === item.url && !isActive(item.url)
                          ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-l-4 border-blue-300 shadow-lg ring-1 ring-blue-100"
                          : ""
                      }
                    `}>
                    <NavLink to={item.url} end>
                      <item.icon
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive(item.url)
                            ? "text-white drop-shadow-sm"
                            : "text-gray-600 group-hover:text-blue-600"
                        }`}
                      />
                      <span
                        className={`transition-all duration-300 ${
                          isActive(item.url)
                            ? "text-white font-bold text-base"
                            : "text-gray-700 group-hover:text-blue-700 group-hover:font-semibold"
                        }`}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
