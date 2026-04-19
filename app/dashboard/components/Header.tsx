"use client";

import { Bell, User, Search, Settings, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="h-20 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-[#1F2937] flex items-center justify-between px-10 sticky top-0 z-40">
      
      {/* LEFT: System Title */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#0077FF]/10 border border-[#0077FF]/20 rounded-full">
          <Shield size={12} className="text-[#00DDFF]" />
          <span className="text-[10px] font-black tracking-widest text-[#00DDFF] uppercase">Secure Session</span>
        </div>
        <h2 className="text-white font-black text-xl tracking-tighter italic uppercase">
          ADMIN <span className="text-gray-600 font-light">//</span> DASHBOARD
        </h2>
      </div>

      {/* RIGHT: Actions & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Functional Icons */}
        <div className="flex items-center gap-4 pr-6 border-r border-[#1F2937]">
          <button className="relative p-2 text-gray-500 hover:text-white transition-colors group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#0077FF] rounded-full border-2 border-[#020617] animate-pulse" />
          </button>
          <button className="p-2 text-gray-500 hover:text-[#00DDFF] transition-colors">
            <Settings size={20} />
          </button>
        </div>

        {/* User Profile Glassmorphism */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 bg-[#0B0E14] border border-[#1F2937] pl-2 pr-5 py-1.5 rounded-2xl cursor-pointer hover:border-[#0077FF]/50 transition-all shadow-xl shadow-black/20"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077FF] to-[#00DDFF] flex items-center justify-center text-black">
            <User size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-white tracking-tight leading-none uppercase italic">Primary Admin</span>
            <span className="text-[9px] font-bold text-[#0077FF] tracking-widest uppercase mt-1">Authorized Node</span>
          </div>
        </motion.div>
        
      </div>
    </header>
  );
}