"use client";

import { motion } from "framer-motion";
import { Users, Mail, ShieldCheck, ChevronRight } from "lucide-react";

export default function ManagersPanel({ managers }: { managers: any[] }) {
  return (
    <div className="bg-[#0B0E14] border border-[#1F2937] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0077FF]/5 blur-[60px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1F2937] rounded-lg text-[#00DDFF]">
            <ShieldCheck size={18} />
          </div>
          <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase italic">
            Presiding Managers
          </h2>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest">
          {managers.length} Nodes Active
        </div>
      </div>

      {/* Managers List */}
      <div className="space-y-4">
        {managers.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-[#1F2937] rounded-2xl">
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">No managers identified</p>
          </div>
        ) : (
          managers.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex justify-between items-center bg-black/40 border border-[#1F2937] p-5 rounded-2xl hover:border-[#0077FF]/40 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Avatar / Node Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#1F2937] border border-white/5 flex items-center justify-center text-white font-black text-xs group-hover:bg-[#0077FF] group-hover:text-black transition-all duration-500 shadow-inner">
                  {m.name ? m.name.charAt(0).toUpperCase() : <Users size={16} />}
                </div>

                <div className="flex flex-col">
                  <p className="text-sm font-black text-white tracking-tight uppercase italic group-hover:text-[#00DDFF] transition-colors">
                    {m.name || "UNNAMED_MANAGER"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={10} className="text-gray-600" />
                    <p className="text-[10px] font-bold text-gray-500 truncate max-w-[150px]">
                      {m.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Size Badge */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-black text-[#0077FF] tracking-tighter uppercase">
                  {m.teamSize || 0} Members
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.min(m.teamSize, 5) }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-emerald-500/40" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer / Action */}
      <button className="w-full mt-8 py-4 border border-[#1F2937] rounded-2xl text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 group">
        Full Directory <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}