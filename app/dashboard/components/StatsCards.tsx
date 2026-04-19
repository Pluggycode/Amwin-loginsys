"use client";

import { motion } from "framer-motion";
import { Users, Clock, CheckCircle, XCircle, Activity } from "lucide-react";

export default function StatsCards({ stats }: { stats: any }) {
  const items = [
    {
      label: "Identity Nodes",
      value: stats.totalUsers,
      icon: Users,
      color: "#0077FF",
      status: "Online"
    },
    {
      label: "Pending Sync",
      value: stats.pendingUsers,
      icon: Clock,
      color: "#00DDFF",
      status: "Awaiting"
    },
    {
      label: "Authorized",
      value: stats.approvedUsers,
      icon: CheckCircle,
      color: "#10b981",
      status: "Verified"
    },
    {
      label: "Terminated",
      value: stats.rejectedUsers,
      icon: XCircle,
      color: "#ef4444",
      status: "Rejected"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item, i) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-[#0B0E14] p-8 rounded-[32px] border border-[#1F2937] hover:border-[#0077FF]/40 transition-all duration-500 shadow-2xl relative group overflow-hidden"
          >
            {/* Background Glow Detail */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#0077FF]/5 blur-[40px] rounded-full group-hover:bg-[#0077FF]/10 transition-colors" />

            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-white/5 rounded-xl text-gray-500 group-hover:text-white group-hover:bg-white/10 transition-all duration-500">
                <Icon size={22} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: item.color }}>
                  {item.status}
                </span>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase mb-2">
                {item.label}
              </p>
              <h2 className="text-4xl font-black text-white italic tracking-tighter group-hover:scale-105 transition-transform origin-left duration-500">
                {item.value?.toLocaleString() || "0"}
              </h2>
            </div>

            {/* Bottom Accent */}
            <div className="mt-6 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
              <Activity size={12} className="text-[#0077FF]" />
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#0077FF] to-transparent" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}