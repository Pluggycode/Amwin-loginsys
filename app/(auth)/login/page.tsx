"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Command, Mail, Lock, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { routeUser } from "../../lib/routeUser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const handleLogin = async () => {
  setLoading(true);
  setError("");

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error);
    setLoading(false);
    return;
  }

  const user = data.user;

  // ✅ Store session (temporary)
  localStorage.setItem("user", JSON.stringify(user));

  // 🚀 ROLE-BASED ROUTING
  routeUser(user);

  setLoading(false);
};

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 relative overflow-hidden font-sans">
      
      {/* Background Visual Depth (Sapphire Glows) */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0077FF]/10 blur-[120px] rounded-full z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00DDFF]/5 blur-[100px] rounded-full z-0" />

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
        transition={{ duration: 0.8 }}
        className="w-full max-w-[450px] relative z-10"
      >
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-12">
          <div 
            className="p-4 bg-linear-to-br from-[#0077FF] to-[#00DDFF] rounded-3xl text-black mb-6 shadow-2xl shadow-[#0077FF]/40 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Command size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase leading-none">Access Portal</h1>
          <p className="text-gray-500 text-[10px] mt-3 uppercase tracking-[0.4em] font-bold">Secure Node Identification</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#0B0E14]/80 backdrop-blur-2xl border border-[#1F2937] p-10 rounded-[40px] shadow-2xl shadow-black/50">
          <div className="space-y-8">
            
            {/* Email Field */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">System Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00DDFF] transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="IDENTIFIER@AMWIN.SYS"
                  className="w-full bg-black border border-[#1F2937] p-5 pl-14 rounded-2xl text-white outline-none focus:border-[#0077FF]/50 transition-all placeholder:text-gray-800 text-sm font-medium"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">Encrypted Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00DDFF] transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-black border border-[#1F2937] p-5 pl-14 rounded-2xl text-white outline-none focus:border-[#0077FF]/50 transition-all placeholder:text-gray-800 text-sm font-medium"
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

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full relative overflow-hidden group py-5 rounded-2xl bg-linear-to-r from-[#0077FF] to-[#00DDFF] text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#0077FF]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  "Authenticating..."
                ) : (
                  <>
                    Initialize Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Signup Redirect */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            Unregistered Node?{" "}
            <span
              className="text-[#00DDFF] cursor-pointer hover:underline underline-offset-8 decoration-2 transition-all"
              onClick={() => router.push("/signup")}
            >
              Initialize Credentials
            </span>
          </p>
        </div>
      </motion.div>

      {/* Subtle Bottom Branding */}
      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.5em]">Amwin // Secure System Protocol v4.0</p>
      </div>
    </div>
  );
}