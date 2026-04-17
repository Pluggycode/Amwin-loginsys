import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        role: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(users);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}