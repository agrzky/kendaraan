import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { AnimatedBackground } from "@/components/animated-background";
import Image from "next/image";
import { Car, BarChart3, ShieldCheck } from "lucide-react";

// Force dynamic rendering for this page (uses cookies for auth check)
export const dynamic = "force-dynamic";

function LoginContent() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 lg:p-8 overflow-x-hidden font-sans">
      {/* 1. Animated Background */}
      <AnimatedBackground />

      {/* 2. Main Content Container */}
      <div className="relative z-10 w-full max-w-[1280px] grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
        {/* LEFT SIDE: Text & Branding (Floating on background) */}
        <div className="text-white space-y-6 lg:space-y-8 pl-0 lg:pl-12 order-1 lg:order-1 lg:text-left text-center pt-8 lg:pt-0">
          {/* Logo Section */}
          {/* Logo Section */}
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-8 lg:mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl hover:bg-white/15 hover:scale-105 transition-all duration-300">
                <Image
                  src="/logo-bkn.png"
                  alt="Logo BKN"
                  width={64}
                  height={64}
                  className="drop-shadow-2xl w-[60px] h-[60px] lg:w-[72px] lg:h-[72px]"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col lg:items-start items-center space-y-1">
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                PusbangSDM <span className="text-blue-400">BKN</span>
              </h2>
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8 bg-blue-500 rounded-full"></div>
                <p className="text-blue-200 font-bold text-xs lg:text-sm tracking-[0.25em] uppercase drop-shadow-sm">
                  Vehicle Management System
                </p>
              </div>
            </div>
          </div>

          {/* Headlines */}
          <div className="space-y-2 drop-shadow-lg">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Sistem Manajemen
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              <span className="text-cyan-400">Servis Kendaraan</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-xl text-slate-200 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0 drop-shadow-md px-4 lg:px-0">
            Platform modern untuk efisiensi pengelolaan kendaraan operasional,
            pemantauan jadwal servis, dan optimalisasi perawatan kendaraan.
          </p>

          {/* Feature Icons (Circle Bottom) */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 mt-8 lg:mt-12 pb-8 lg:pb-0">
            {/* Kendaraan - Blue Theme */}
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/20 border border-blue-400/30 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-400 group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 backdrop-blur-sm">
                  <Car className="w-6 h-6 lg:w-7 lg:h-7 text-blue-300 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <span className="text-[10px] lg:text-xs font-bold text-blue-200 group-hover:text-blue-400 tracking-wider uppercase transition-colors duration-300">
                Kendaraan
              </span>
            </div>

            {/* Analitik - Cyan Theme */}
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 rounded-full blur opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 border border-cyan-400/30 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-600 transition-all duration-300 backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 lg:w-7 lg:h-7 text-cyan-300 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <span className="text-[10px] lg:text-xs font-bold text-cyan-200 group-hover:text-cyan-400 tracking-wider uppercase transition-colors duration-300">
                Analitik
              </span>
            </div>

            {/* Fasilitas - Indigo Theme */}
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 border border-indigo-400/30 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-600 transition-all duration-300 backdrop-blur-sm">
                  <ShieldCheck className="w-6 h-6 lg:w-7 lg:h-7 text-indigo-300 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <span className="text-[10px] lg:text-xs font-bold text-indigo-200 group-hover:text-indigo-400 tracking-wider uppercase transition-colors duration-300">
                Fasilitas
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Card (White Floating Card) */}
        <div className="w-full max-w-[420px] lg:max-w-[480px] mx-auto order-2 lg:order-2 px-2 lg:px-0 pb-12 lg:pb-0">
          <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl p-6 sm:p-8 lg:p-12 relative overflow-hidden">
            {/* Simple form wrapper */}
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
