"use client";

import { useEffect, useState } from "react";
import StatsCards from "../components/StatsCards";
import UsersTable from "../components/UsersTable";
import ManagersPanel from "../components/ManagersPanel";
import DepartmentStats from "../components/DepartmentStats";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center mt-20">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <StatsCards stats={data.stats} />

      <div className="grid lg:grid-cols-3 gap-6">
        <DepartmentStats data={data.departments} />
        <ManagersPanel managers={data.managers} />
      </div>

      <UsersTable users={data.users} />
    </div>
  );
}