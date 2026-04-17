import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1];

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({
      userId: decoded.userId,
      role: decoded.role,
      status: decoded.status,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}