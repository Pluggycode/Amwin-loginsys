// /app/api/auth/login/route.ts

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  if (user.status !== "APPROVED") {
    return Response.json({ error: "Not approved yet" }, { status: 403 });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role?.name,
      status: user.status,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return Response.json({ message: "Login successful" });
}