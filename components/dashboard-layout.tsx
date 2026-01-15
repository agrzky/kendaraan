"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart3,
  Car,
  Home,
  LogOut,
  Menu,
  Settings,
  Wrench,
  Receipt,
} from "lucide-react";
import { useAuth } from "@/components/auth-guard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Data Kendaraan", href: "/dashboard/vehicles", icon: Car },
  { name: "Riwayat Servis", href: "/dashboard/service-history", icon: Wrench },
  { name: "Rekap BBM&TOL", href: "/dashboard/rekap-bbm-tol", icon: Receipt },
  { name: "Laporan", href: "/dashboard/reports", icon: BarChart3 },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API to clear HTTP-only cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "w-full" : "w-full"}`}>
      <div className="flex items-center gap-4 px-6 py-8">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <img
            src="/logo-bkn.png"
            alt="Logo BKN"
            width={48}
            height={48}
            className="object-contain drop-shadow-md"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-bold text-gray-900 text-lg leading-tight">
            Pusbang<span className="text-emerald-600">SDM</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
            Bagian Kendaraan
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Menu Utama
        </p>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <div key={item.name}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-4 h-12 text-sm font-medium transition-all duration-300 rounded-2xl relative overflow-hidden ${
                  isActive
                    ? "text-white shadow-lg shadow-emerald-500/20"
                    : "text-gray-600 hover:text-emerald-700"
                }`}
                onClick={() => {
                  router.push(item.href);
                  if (mobile) setSidebarOpen(false);
                }}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl" />
                )}
                <div className="relative z-10 flex items-center gap-4">
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-emerald-500"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
              </Button>
            </div>
          );
        })}
      </nav>
    </div>
  );

  const getPageTitle = () => {
    const currentNav = navigation.find((nav) => nav.href === pathname);
    return currentNav?.name || "Dashboard";
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply"></div>
      </div>

      {/* Desktop Sidebar (Glass) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col p-4 z-50">
        <div className="flex flex-col flex-grow bg-white border border-gray-200/50 rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 bg-transparent border-0 shadow-none"
        >
          <div className="h-full w-full bg-white/90 backdrop-blur-3xl border-r border-white/40 p-4">
            <Sidebar mobile />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navigation (Floating Glass) */}
        <div className="sticky top-4 z-40 px-4 lg:px-6 mb-2">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-2 hover:bg-white/50"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="p-0 w-72 bg-transparent border-0"
                >
                  <div className="h-full w-full bg-white/80 backdrop-blur-3xl border-r border-white/40 p-4">
                    <Sidebar mobile />
                  </div>
                </SheetContent>
              </Sheet>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 truncate ml-2">
                {getPageTitle()}
              </h2>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full ring-2 ring-white/50 shadow-sm hover:ring-emerald-400/50 transition-all"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                      A
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white/80 backdrop-blur-xl border-white/50 rounded-xl shadow-lg"
                align="end"
              >
                <div className="flex items-center justify-start gap-3 p-3 bg-emerald-50/50 rounded-lg mb-1">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-bold text-gray-800">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {isAdmin && (
                      <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <DropdownMenuItem
                  onSelect={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer rounded-lg my-1"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-6 pt-2">{children}</main>
      </div>
    </div>
  );
}
