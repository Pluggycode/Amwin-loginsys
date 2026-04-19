"use client";

import { motion } from "framer-motion";
import { Database, User, Shield, Briefcase, Network, Cpu } from "lucide-react";

export default function UsersTable({ users }: { users: any[] }) {
  return (
    <div className="bg-[#0B0E14] border border-[#1F2937] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0077FF]/50 to-transparent" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1F2937] rounded-xl text-[#0077FF] group-hover:bg-[#0077FF] group-hover:text-black transition-all duration-500">
            <Database size={20} />
          </div>
          <h2 className="text-xl font-black tracking-tighter italic text-white uppercase">
            Node Registry <span className="text-gray-600 font-light ml-2">// ALL_IDENTITIES</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-[#00DDFF] uppercase tracking-widest">
          <Cpu size={12} className="animate-pulse" />
          {users.length} Records Loaded
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase border-b border-[#1F2937]">
              <th className="text-left px-4 py-5 font-black">Node Name</th>
              <th className="text-left px-4 py-5 font-black">Communication</th>
              <th className="text-left px-4 py-5 font-black">Clearance</th>
              <th className="text-left px-4 py-5 font-black">Assignment</th>
              <th className="text-left px-4 py-5 font-black">Presiding Manager</th>
              <th className="text-right px-4 py-5 font-black">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1F2937]">
            {users.map((u: any, i: number) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group/row hover:bg-[#0077FF]/5 transition-colors cursor-default"
              >
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center text-[#0077FF] text-xs font-black border border-white/5 group-hover/row:bg-[#0077FF] group-hover/row:text-black transition-all">
                      {u.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-sm font-bold text-white uppercase italic tracking-tight">
                      {u.name || "UNNAMED_NODE"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5 text-xs font-medium text-gray-400 font-mono tracking-tighter">
                  {u.email}
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-2">
                    <Shield size={12} className="text-[#0077FF]" />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      {u.role?.name || "GUEST"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-2">
                    <Briefcase size={12} className="text-gray-600" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {u.department?.name || "UNASSIGNED"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                    <Network size={12} />
                    {u.manager?.email ? u.manager.email.split('@')[0] : "DIRECT"}
                  </div>
                </td>
                <td className="px-4 py-5 text-right">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                      u.status === "APPROVED"
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                        : u.status === "PENDING"
                        ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                        : "bg-red-500/5 border-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                    }`}
                  >
                    <div className={`w-1 h-1 rounded-full animate-pulse ${
                      u.status === "APPROVED" ? "bg-emerald-400" : u.status === "PENDING" ? "bg-yellow-400" : "bg-red-400"
                    }`} />
                    {u.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination Decor */}
      <div className="mt-8 pt-6 border-t border-[#1F2937] flex justify-between items-center text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">
        <span>Encrypted System Data // Amwin OS</span>
        <div className="flex gap-4">
          <span className="text-[#0077FF] cursor-pointer">Export CSV</span>
          <span className="cursor-pointer">Next Frame</span>
        </div>
      </div>
    </div>
  );
}