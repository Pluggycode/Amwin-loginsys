import { prisma } from "../../../lib/prisma";
import { sendApprovalEmail } from "../../../lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, action, roleName, departmentName, managerId } = body;

    // ✅ Basic validation
    if (!userId || !action) {
      return Response.json(
        { error: "userId and action are required" },
        { status: 400 }
      );
    }

    const normalizedAction = action.toUpperCase();

    // 🔍 Check user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (!existingUser) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ============================
    // ❌ REJECT USER
    // ============================
    if (normalizedAction === "REJECT") {
      await prisma.user.update({
        where: { id: userId },
        data: { status: "REJECTED" },
      });

      try {
        await sendApprovalEmail(existingUser.email, "REJECTED");
      } catch (err) {
        console.error("Email failed (REJECT):", err);
      }

      return Response.json({
        success: true,
        message: "User rejected successfully",
      });
    }

    // ============================
    // ✅ APPROVE USER
    // ============================
    if (normalizedAction === "APPROVE") {
      if (!roleName || !departmentName) {
        return Response.json(
          { error: "roleName and departmentName are required" },
          { status: 400 }
        );
      }

      const roleKey = roleName.toUpperCase();
      const deptKey = departmentName.toUpperCase();

      // 🔹 ROLE (auto-create)
      let role = await prisma.role.findFirst({
        where: {
          name: {
            equals: roleKey,
            mode: "insensitive",
          },
        },
      });

      if (!role) {
        role = await prisma.role.create({
          data: { name: roleKey },
        });
      }

      // 🔹 DEPARTMENT (auto-create)
      let department = await prisma.department.findFirst({
        where: {
          name: {
            equals: deptKey,
            mode: "insensitive",
          },
        },
      });

      if (!department) {
        department = await prisma.department.create({
          data: { name: deptKey },
        });
      }

      // ============================
      // 🔴 BUSINESS RULES
      // ============================

      // EMPLOYEE must have manager
      if (role.name === "EMPLOYEE" && !managerId) {
        return Response.json(
          { error: "Employee must have a manager" },
          { status: 400 }
        );
      }

      // ADMIN / MANAGER should NOT have manager
      let finalManagerId: string | null = null;

      if (role.name === "EMPLOYEE") {
        // 🔍 Validate manager exists
        const manager = await prisma.user.findUnique({
          where: { id: managerId },
          include: {
            role: true,
          },
        });

        if (!manager) {
          return Response.json(
            { error: "Manager not found" },
            { status: 404 }
          );
        }

        // ❌ Prevent self assignment
        if (manager.id === userId) {
          return Response.json(
            { error: "User cannot be their own manager" },
            { status: 400 }
          );
        }

        // ❌ Ensure manager role is MANAGER
        if (manager.role?.name !== "MANAGER") {
          return Response.json(
            { error: "Assigned manager must have MANAGER role" },
            { status: 400 }
          );
        }

        finalManagerId = managerId;
      }

      // ============================
      // ✅ UPDATE USER
      // ============================
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          status: "APPROVED",
          roleId: role.id,
          departmentId: department.id,
          managerId: finalManagerId,
        },
      });

      // 📧 Send email (non-blocking)
      try {
        await sendApprovalEmail(updatedUser.email, "APPROVED");
      } catch (err) {
        console.error("Email failed (APPROVE):", err);
      }

      return Response.json({
        success: true,
        message: "User approved successfully",
        role: role.name,
        department: department.name,
      });
    }

    // ============================
    // ❌ INVALID ACTION
    // ============================
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