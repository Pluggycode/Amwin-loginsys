"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (
    userId: string,
    action: "APPROVE" | "REJECT",
    roleName?: string
  ) => {
    await fetch("/api/admin/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, action, roleName }),
    });

    fetchUsers();
  };

  if (loading) {
    return (
      <div className="p-10 text-white">Loading users...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Approvals</h1>
        <p className="text-gray-400">
          Manage pending user access and roles
        </p>
      </div>

      {/* Users Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 && (
          <p className="text-gray-500">No pending users</p>
        )}

        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onAction={handleAction}
          />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user, onAction }: any) {
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onAction(user.id, "APPROVE", role);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await onAction(user.id, "REJECT");
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
      {/* User Info */}
      <div className="mb-4">
        <p className="text-lg font-semibold">{user.email}</p>
        <p className="text-sm text-gray-400">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Role Selector */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg bg-gray-800 border border-gray-700"
      >
        <option value="ADMIN">Admin</option>
        <option value="SALES">Sales</option>
        <option value="TECH">Tech</option>
      </select>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg"
        >
          {loading ? "Processing..." : "Approve"}
        </button>

        <button
          onClick={handleReject}
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
        >
          Reject
        </button>
      </div>
    </div>
  );
}