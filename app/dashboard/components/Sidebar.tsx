"use client";

import { sidebarConfig } from "@/config/sidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Command, LogOut, ChevronRight } from "lucide-react";

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const links = sidebarConfig[role as keyof typeof sidebarConfig] || [];

  return (
    <aside className="w-72 h-screen bg-[#0B0E14] border-r border-[#1F2937] p-8 flex flex-col sticky top-0 z-50">
      {/* BRANDING SECTION */}
      <div 
        className="flex items-center gap-3 mb-12 group cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="p-2.5 bg-gradient-to-br from-[#0077FF] to-[#00DDFF] rounded-xl text-black shadow-lg shadow-[#0077FF]/20 group-hover:scale-110 transition-transform duration-300">
          <Command size={22} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-white font-black text-xl tracking-tighter leading-none italic uppercase">AMWIN</h2>
          <span className="text-[9px] font-bold text-gray-600 tracking-[0.3em] uppercase">Systems OS</span>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black tracking-[0.3em] text-gray-700 uppercase mb-6 ml-2">Protocol Access</p>
        
        {links.map((link: any) => {
          const isActive = pathname === link.path;
          
          return (
            <Link
              key={link.path}
              href={link.path}
              className="relative block group"
            >
              <div className={`
                flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 border
                ${isActive 
                  ? "bg-[#0077FF]/10 border-[#0077FF]/30 text-white shadow-[0_0_20px_rgba(0,119,255,0.05)]" 
                  : "bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5"
                }
              `}>
                <div className="flex items-center gap-4">
                  {/* If your config has icons, they render here. Otherwise, a dot appears. */}
                  {link.icon ? (
                    <span className={`${isActive ? "text-[#00DDFF]" : "text-gray-600 group-hover:text-[#0077FF] transition-colors"}`}>
                      {link.icon}
                    </span>
                  ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#00DDFF] animate-pulse" : "bg-gray-700"}`} />
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest leading-none">
                    {link.name}
                  </span>
                </div>

                {isActive && (
                  <motion.div layoutId="activeIndicator">
                    <ChevronRight size={14} className="text-[#00DDFF]" />
                  </motion.div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SECTION (Termination / Profile) */}
      <div className="mt-auto pt-8 border-t border-[#1F2937]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center text-[10px] font-black text-white border border-white/5">
              {role.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white tracking-widest uppercase">Node Clearance</span>
              <span className="text-[10px] font-bold text-[#0077FF] tracking-tighter uppercase italic">{role}</span>
            </div>
          </div>

          <button 
            onClick={() => router.push('/login')}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-[0.2em] mt-2"
          >
            <LogOut size={16} />
            Terminate
          </button>
        </div>
      </div>
    </aside>
  );
}