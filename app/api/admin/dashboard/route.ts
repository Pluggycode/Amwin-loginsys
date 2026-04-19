import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    // 🔹 PARALLEL QUERIES (FAST)
    const [
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      managers,
      users,
      departments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { status: "APPROVED" } }),
      prisma.user.count({ where: { status: "REJECTED" } }),

      // Managers with team size
      prisma.user.findMany({
        where: {
          role: { name: "MANAGER" },
          status: "APPROVED",
        },
        include: {
          _count: {
            select: { subordinates: true },
          },
        },
      }),

      // All users
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          role: { select: { name: true } },
          department: { select: { name: true } },
          manager: {
            select: { id: true, email: true, name: true },
          },
        },
      }),

      // Department distribution
      prisma.department.findMany({
        include: {
          _count: {
            select: { users: true },
          },
        },
      }),
    ]);

    return Response.json({
      success: true,

      stats: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        rejectedUsers,
        totalManagers: managers.length,
      },

      managers: managers.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        teamSize: m._count.subordinates,
      })),

      users,

      departments: departments.map((d) => ({
        name: d.name,
        count: d._count.users,
      })),
    });

  } catch (error: any) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to load dashboard",
      },
      { status: 500 }
    );
  }
}