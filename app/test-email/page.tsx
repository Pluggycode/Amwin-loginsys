"use client";

import { useState } from "react";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const sendEmail = async () => {
    if (!email) {
      addLog("❌ Please enter an email");
      return;
    }

    setLoading(true);
    addLog("📨 Sending email...");

    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        addLog("❌ RAW RESPONSE: " + text);
        throw new Error("Invalid JSON");
      }

      if (!res.ok) {
        addLog("❌ Error: " + JSON.stringify(data));
      } else {
        addLog("✅ Email sent successfully");
        addLog("📦 Response: " + JSON.stringify(data));
      }
    } catch (err) {
      addLog("❌ Request failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Email Tester</h1>

      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
        />

        <button
          onClick={sendEmail}
          disabled={loading}
          className="w-full bg-indigo-600 py-3 rounded"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </div>

      <div className="mt-6 w-full max-w-xl bg-black p-4 rounded">
        {logs.length === 0 && (
          <p className="text-gray-500">No logs yet...</p>
        )}

        {logs.map((log, i) => (
          <p key={i} className="text-green-400 text-sm">
            {log}
          </p>
        ))}
      </div>
    </div>
  );
}