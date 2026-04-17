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

    // 🔍 Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        status: "PENDING",
      },
    });

    return Response.json({
      message: "Signup successful, waiting for approval",
      userId: user.id,
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}