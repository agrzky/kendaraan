"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User, LogIn, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(
            data.error ||
              "Terlalu banyak percobaan login. Silakan tunggu beberapa menit."
          );
          return;
        }

        setError(data.error || "Username atau password salah");
        return;
      }

      if (data.success && data.user) {
        // Save user data to localStorage for client-side access
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-10 text-left">
        <h1 className="text-4xl text-center font-extrabold text-slate-800 tracking-tight leading-none mb-3">
          Selamat Datang
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2.5"
        >
          <Label
            htmlFor="username"
            className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
          >
            Username
          </Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" />
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-slate-800 placeholder:text-slate-400 font-medium transition-all duration-300"
              required
              autoComplete="username"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2.5"
        >
          <Label
            htmlFor="password"
            className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
          >
            Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 h-14 bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-slate-800 placeholder:text-slate-400 font-medium transition-all duration-300"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-all"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
            >
              <Alert className="border-red-100 bg-red-50 rounded-2xl">
                <AlertDescription className="text-red-600 text-sm font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-2"
        >
          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group overflow-hidden relative"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {isLoading ? (
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="tracking-wide">Sedang Masuk...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 relative z-10">
                <span className="tracking-wide">Masuk Aplikasi</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">
          BKN PusbangSDM
        </p>
        <p className="text-[10px] font-medium text-slate-500">
          © {currentYear} All Rights Reserved
        </p>
      </motion.div>
    </motion.div>
  );
}
