export function routeUser(user: any) {
  const role = user.role;
  const dept = user.department;

  // 🔴 ADMIN
  if (role === "ADMIN") {
    window.location.href = "/dashboard/admin";
    return;
  }

  // 🟡 MANAGER
  if (role === "MANAGER") {
    window.location.href = `/dashboard/manager/${dept?.toLowerCase()}`;
    return;
  }

  // 🟢 EMPLOYEE
  if (role === "EMPLOYEE") {
    window.location.href = `/dashboard/employee/${dept?.toLowerCase()}`;
    return;
  }

  // ❌ FALLBACK
  window.location.href = "/login";
}