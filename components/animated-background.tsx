"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#0f172a] overflow-hidden">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-950/40"></div>

      {/* Animated Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-cyan-500/10 rounded-full blur-[100px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"
      />

      {/* Grid Pattern Overlay with Pulse */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 mask-image:linear-gradient(to_bottom,transparent,black,transparent)"></div>

      {/* Noise Texture for Texture */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}
