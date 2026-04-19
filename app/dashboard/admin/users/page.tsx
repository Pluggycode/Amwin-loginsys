"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, ShieldAlert, RefreshCcw } from "lucide-react";
import UserCard from "./UserCard";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (
    userId: string,
    action: "APPROVE" | "REJECT",
    roleName?: string,
    departmentName?: string,
    managerId?: string
  ) => {
    try {
      await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action,
          roleName,
          departmentName,
          managerId,
        }),
      });

      fetchUsers();
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <RefreshCcw className="animate-spin text-[#0077FF] mb-4" size={32} />
        <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-50">
          Syncing Users...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10">
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#0077FF] rounded-lg text-black">
            <Command size={20} />
          </div>
          <span className="text-[10px] tracking-[0.4em] text-gray-500 uppercase">
            Admin Panel
          </span>
        </div>

        <h1 className="text-5xl font-black italic mb-4">
          USER APPROVALS
        </h1>

        <p className="text-gray-400">
          Approve users, assign roles, departments and managers.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <AnimatePresence>
          {users.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 border border-dashed border-gray-700 rounded-3xl flex flex-col items-center text-gray-500"
            >
              <ShieldAlert size={40} className="mb-4 opacity-30" />
              <p>No pending users</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}