"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Command, Mail, Lock, User, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState(""); // New State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }), // Sending Name to API
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      router.push("/pending");
    } catch (err) {
      setError("Network error. System unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 relative overflow-hidden font-sans">
      
      {/* Visual Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0077FF]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00DDFF]/5 blur-[100px] rounded-full" />

      {/* Floating Back Button */}
      <button 
        onClick={() => router.push('/')}
        className="absolute top-10 left-10 flex items-center gap-2 text-gray-500 hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group z-20"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Matrix
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-gradient-to-br from-[#0077FF] to-[#00DDFF] rounded-[24px] text-black mb-6 shadow-2xl shadow-[#0077FF]/40">
            <Command size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">Initialize Node</h1>
          <p className="text-gray-500 text-[10px] mt-3 uppercase tracking-[0.4em] font-bold">New Identity Registration</p>
        </div>

        {/* Signup Card */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[40px] shadow-2xl">
          <div className="space-y-6">
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00DDFF] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/5 p-4 pl-14 rounded-2xl text-white outline-none focus:border-[#0077FF]/50 transition-all placeholder:text-gray-800 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">System Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00DDFF] transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="identifier@amwin.sys"
                  className="w-full bg-white/5 border border-white/5 p-4 pl-14 rounded-2xl text-white outline-none focus:border-[#0077FF]/50 transition-all placeholder:text-gray-800 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">Secure Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00DDFF] transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 p-4 pl-14 rounded-2xl text-white outline-none focus:border-[#0077FF]/50 transition-all placeholder:text-gray-800 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-wider"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full relative overflow-hidden group py-5 rounded-2xl bg-gradient-to-r from-[#0077FF] to-[#00DDFF] text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#0077FF]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Registering Node..." : (
                <div className="flex items-center justify-center gap-3">
                  Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            Existing Identity?{" "}
            <span
              className="text-[#00DDFF] cursor-pointer hover:underline underline-offset-8 decoration-2 transition-all"
              onClick={() => router.push("/login")}
            >
              Access Portal
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}