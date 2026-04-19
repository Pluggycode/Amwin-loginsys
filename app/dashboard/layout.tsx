"use client";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⚠️ TEMP: Replace later with auth/session
  const role = "ADMIN"; // dynamic later

  return (
    <div className="flex bg-[#020617] min-h-screen text-white">
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}