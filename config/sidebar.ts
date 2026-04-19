export const sidebarConfig = {
  ADMIN: [
    { name: "Dashboard", path: "/dashboard/admin" },
    { name: "Users", path: "/dashboard/admin/users" },
    { name: "Managers", path: "/dashboard/admin/managers" },
    { name: "Departments", path: "/dashboard/admin/departments" },
  ],

  MANAGER: [
    { name: "Dashboard", path: "/dashboard/manager" },
    { name: "Team", path: "/dashboard/manager/team" },
    { name: "Tasks", path: "/dashboard/manager/tasks" },
  ],

  EMPLOYEE: [
    { name: "Dashboard", path: "/dashboard/employee" },
    { name: "My Tasks", path: "/dashboard/employee/tasks" },
  ],
};