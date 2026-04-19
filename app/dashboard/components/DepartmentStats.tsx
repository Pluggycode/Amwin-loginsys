"use client";

import { motion } from "framer-motion";
import { Layers, ChevronRight } from "lucide-react";

export default function DepartmentStats({ data }: { data: { name: string; count: number }[] }) {
  // Calculate max count for relative percentage bars
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-[#0B0E14] border border-[#1F2937] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0077FF]/5 blur-[60px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1F2937] rounded-lg text-[#0077FF] group-hover:bg-[#0077FF] group-hover:text-black transition-all duration-500">
            <Layers size={18} />
          </div>
          <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase italic">
            Unit Distribution
          </h2>
        </div>
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Active Nodes</span>
      </div>

      {/* Stats List */}
      <div className="space-y-8">
        {data.map((d, i) => {
          const percentage = (d.count / maxCount) * 100;

          return (
            <div key={i} className="group/item">
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 group-hover/item:text-white transition-colors uppercase tracking-tight">
                    {d.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white italic leading-none">
                    {d.count.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">Units</span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="relative w-full bg-black border border-white/5 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0077FF] to-[#00DDFF] rounded-full shadow-[0_0_15px_rgba(0,119,255,0.3)]"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
        <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">
          Telemetry Verified
        </p>
        <ChevronRight size={14} className="text-gray-800" />
      </div>
    </div>
  );
}