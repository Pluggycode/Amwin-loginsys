"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const handleLogin = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    // ⏳ IMPORTANT: wait a moment for cookie to be set
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 🔥 Fetch user AFTER cookie is stable
    const meRes = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    const me = await meRes.json();

    console.log("USER:", me);

    // 🚀 Use replace instead of push
    if (me.role === "ADMIN") {
      router.replace("/dashboard/admin");
    } else if (me.role === "SALES") {
      router.replace("/dashboard/sales");
    } else if (me.role === "TECH") {
      router.replace("/dashboard/technical");
    } else {
      router.replace("/dashboard");
    }
  } catch (err) {
    setError("Something went wrong");
  }

  setLoading(false);
};

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
      <p className="text-gray-500 mb-6">Login to your account</p>

      <input
        className="w-full border p-3 rounded-lg mb-4"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-3 rounded-lg mb-4"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push("/signup")}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}