"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

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
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/pending");
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Create Account</h1>
      <p className="text-gray-500 mb-6">Get started with Amwin CRM</p>

      <input
        className="w-full border p-3 rounded-lg mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-3 rounded-lg mb-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Creating..." : "Sign Up"}
      </button>

      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}