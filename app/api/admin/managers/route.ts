import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    // ✅ Get all users with MANAGER role
    const managers = await prisma.user.findMany({
      where: {
        status: "APPROVED",
        role: {
          name: "MANAGER",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(managers);

  } catch (error: any) {
    console.error("FETCH MANAGERS ERROR:", error);

    return Response.json(
      {
        error: "Internal server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}