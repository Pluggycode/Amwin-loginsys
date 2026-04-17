import { prisma } from "../../../lib/prisma";
import { sendApprovalEmail } from "../../../lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, action, roleName } = body;

    // ✅ Validate input
    if (!userId || !action) {
      return Response.json(
        { error: "userId and action are required" },
        { status: 400 }
      );
    }

    const normalizedAction = action.toUpperCase();

    // 🔍 Check if user exists first (important)
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 🔴 REJECT USER
    if (normalizedAction === "REJECT") {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { status: "REJECTED" },
      });

      // 📧 Send Email (don't block main flow)
      try {
        await sendApprovalEmail(user.email, "REJECTED");
      } catch (err) {
        console.error("Email failed (REJECT):", err);
      }

      return Response.json({
        success: true,
        message: "User rejected",
      });
    }

    // 🟢 APPROVE USER
    if (normalizedAction === "APPROVE") {
      if (!roleName) {
        return Response.json(
          { error: "roleName is required for approval" },
          { status: 400 }
        );
      }

      // 🔍 Find role (case insensitive)
      let role = await prisma.role.findFirst({
        where: {
          name: {
            equals: roleName,
            mode: "insensitive",
          },
        },
      });

      // ➕ Create role if not exists
      if (!role) {
        role = await prisma.role.create({
          data: { name: roleName.toUpperCase() },
        });
      }

      // ✅ Update user
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          status: "APPROVED",
          roleId: role.id,
        },
      });

      // 📧 Send Email (non-blocking)
      try {
        await sendApprovalEmail(user.email, "APPROVED");
      } catch (err) {
        console.error("Email failed (APPROVE):", err);
      }

      return Response.json({
        success: true,
        message: "User approved successfully",
        role: role.name,
      });
    }

    // ❌ Invalid action
    return Response.json(
      { error: "Invalid action. Use APPROVE or REJECT" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("APPROVE API ERROR:", error);

    return Response.json(
      {
        error: "Internal server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}