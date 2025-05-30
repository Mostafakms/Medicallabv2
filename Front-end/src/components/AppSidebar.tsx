import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
import { 
  LayoutDashboard, 
  Users, 
  TestTube, 
  FileText, 
  DollarSign, 
  Package, 
  Settings,
  UserCheck
} from 'lucide-react';

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Patient Registration", url: "/patients", icon: Users },
  { title: "Sample Management", url: "/samples", icon: TestTube },
  { title: "Test Management", url: "/tests", icon: TestTube },
  { title: "Results & Reports", url: "/results", icon: FileText },
  { title: "Billing", url: "/billing", icon: DollarSign },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Staff Management", url: "/staff", icon: UserCheck },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) => 
    isActive(path) ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TestTube className="h-5 w-5 text-white" />
            </div>
            {state !== "collapsed" && <span className="font-bold text-lg text-blue-600">LIMS</span>}
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="h-5 w-5" />
                      {state !== "collapsed" && <span>{item.title}</span>}
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
