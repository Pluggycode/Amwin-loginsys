import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    // ✅ Validate input
    if (!name || !email || !password) {
      return Response.json(
        { error: "Name, email and password are required" },
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

    // ✅ Create user (NO ROLE at signup)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: "PENDING",
        // 🚫 DO NOT ADD role or roleId here
      },
    });

    return Response.json({
      success: true,
      message: "Signup successful. Waiting for admin approval.",
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