"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  UserX,
  Mail,
  ShieldCheck,
  Briefcase,
  Users,
  ChevronDown,
  Command,
} from "lucide-react";

export default function UserCard({ user, onAction }: any) {
  const [role, setRole] = useState("EMPLOYEE");
  const [department, setDepartment] = useState("SALES");
  const [managerId, setManagerId] = useState("");
  const [managers, setManagers] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch("/api/admin/managers");
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        setManagers(data);
      } catch (err) {
        console.error("Manager fetch failed");
      }
    };

    fetchManagers();
  }, []);

  const handleApprove = async () => {
    if (role === "EMPLOYEE" && !managerId) {
      alert("CRITICAL: Please select a presiding manager for this node.");
      return;
    }

    setProcessing(true);
    await onAction(user.id, "APPROVE", role, department, managerId);
    setProcessing(false);
  };

  const handleReject = async () => {
    setProcessing(true);
    await onAction(user.id, "REJECT");
    setProcessing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0B0E14] border border-[#1F2937] rounded-[32px] p-8 hover:border-[#0077FF]/50 transition-all duration-500 shadow-2xl relative group overflow-hidden"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0077FF]/30 to-transparent" />

      {/* USER HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#0077FF] mb-3">
          <Mail size={14} />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">Identity Identifier</span>
        </div>

        <p className="text-2xl font-black tracking-tighter text-white truncate mb-1 italic">
          {user.name || "UNNAMED_NODE"}
        </p>

        <p className="text-xs text-gray-500 font-medium truncate tracking-wide">
          {user.email}
        </p>
      </div>

      {/* SELECTORS GRID */}
      <div className="space-y-5 mb-8">
        {/* ROLE SELECTOR */}
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-gray-600 uppercase ml-1 flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#0077FF]" /> Clearance Role
          </label>

          <div className="relative">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setManagerId("");
              }}
              className="w-full p-4 bg-black border border-[#1F2937] rounded-2xl text-xs font-bold text-white outline-none focus:border-[#0077FF] transition-all appearance-none cursor-pointer"
            >
              <option value="ADMIN">ADMINISTRATOR</option>
              <option value="MANAGER">EXECUTIVE MANAGER</option>
              <option value="EMPLOYEE">STANDARD EMPLOYEE</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* DEPARTMENT SELECTOR */}
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-gray-600 uppercase ml-1 flex items-center gap-2">
            <Briefcase size={12} className="text-[#0077FF]" /> Unit Assignment
          </label>

          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-4 bg-black border border-[#1F2937] rounded-2xl text-xs font-bold text-white outline-none focus:border-[#0077FF] transition-all appearance-none cursor-pointer"
            >
              <option value="SALES">SALES & GROWTH</option>
              <option value="TECH">TECH INFRA</option>
              <option value="PURCHASE">PROCUREMENT</option>
              <option value="DELIVERY">LOGISTICS</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* MANAGER SELECTOR (Conditional) */}
        <AnimatePresence>
          {role === "EMPLOYEE" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <label className="text-[10px] font-black tracking-widest text-gray-600 uppercase ml-1 flex items-center gap-2">
                <Users size={12} className="text-[#0077FF]" /> Presiding Manager
              </label>

              <div className="relative">
                <select
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className="w-full p-4 bg-black border border-[#1F2937] rounded-2xl text-xs font-bold text-white outline-none focus:border-[#0077FF] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Manager...</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.email}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={handleApprove}
          disabled={processing}
          className="flex-1 relative group overflow-hidden bg-gradient-to-r from-[#0077FF] to-[#00DDFF] text-black h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#0077FF]/20 flex items-center justify-center gap-2"
        >
          {processing ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <UserCheck size={14} /> Authorize Node
            </>
          )}
        </button>

        <button
          onClick={handleReject}
          disabled={processing}
          className="w-12 h-12 bg-red-500/5 border border-red-500/10 text-red-500 flex items-center justify-center rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
        >
          <UserX size={18} />
        </button>
      </div>
    </motion.div>
  );
}