import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // 🔍 Find user with relations
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        department: true,
      },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔴 Block unapproved users
    if (user.status !== "APPROVED") {
      return Response.json(
        { error: "Waiting for admin approval" },
        { status: 403 }
      );
    }

    // 🔐 Check password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Return structured user
   return Response.json({
  success: true,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ? user.role.name : null,
    department: user.department ? user.department.name : null,
    managerId: user.managerId,
  },
});

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}