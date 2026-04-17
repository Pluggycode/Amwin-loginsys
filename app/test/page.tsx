"use client";

import { useState } from "react";

export default function TestAdminFlow() {
  const [log, setLog] = useState<string[]>([]);
  const [userId, setUserId] = useState("");

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, msg]);
  };

  const buttonStyle =
    "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition";

  const signup = async () => {
    addLog("🔹 Signing up...");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "flowtest@amwin.com",
        password: "123456",
      }),
    });
    addLog("Signup: " + JSON.stringify(await res.json()));
  };

  const loginBefore = async () => {
    addLog("🔹 Login before approval...");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "flowtest@amwin.com",
        password: "123456",
      }),
    });
    addLog("Login (before): " + JSON.stringify(await res.json()));
  };

  const getPending = async () => {
    addLog("🔹 Fetching pending users...");
    const res = await fetch("/api/admin/users");
    const data = await res.json();

    const user = data.find((u: any) => u.email === "flowtest@amwin.com");

    if (user) {
      setUserId(user.id);
      addLog("✅ Found user ID: " + user.id);
    } else {
      addLog("❌ User not found");
    }
  };

  const approve = async () => {
    if (!userId) return addLog("❌ No user ID");

    addLog("🔹 Approving user...");
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        action: "APPROVE",
        roleName: "ADMIN",
      }),
    });

    addLog("Approve: " + JSON.stringify(await res.json()));
  };

  const loginAfter = async () => {
    addLog("🔹 Login after approval...");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "flowtest@amwin.com",
        password: "123456",
      }),
    });

    addLog("Login (after): " + JSON.stringify(await res.json()));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Flow Tester</h1>
        <p className="text-gray-400">
          Test full authentication + approval pipeline
        </p>
      </div>

      {/* Action Panel */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <button className={buttonStyle} onClick={signup}>
          Signup
        </button>
        <button className={buttonStyle} onClick={loginBefore}>
          Login Before
        </button>
        <button className={buttonStyle} onClick={getPending}>
          Get Pending
        </button>
        <button className={buttonStyle} onClick={approve}>
          Approve
        </button>
        <button className={buttonStyle} onClick={loginAfter}>
          Login After
        </button>
      </div>

      {/* Log Panel */}
      <div className="bg-black rounded-2xl p-6 border border-gray-800 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Logs</h2>

        <div className="h-[400px] overflow-y-auto space-y-2 text-sm text-green-400 font-mono">
          {log.length === 0 && (
            <p className="text-gray-500">No logs yet...</p>
          )}
          {log.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}