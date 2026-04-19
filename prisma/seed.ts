import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ✅ Seed Roles
  await prisma.role.createMany({
    data: [
      { name: "ADMIN" },
      { name: "MANAGER" },
      { name: "EMPLOYEE" },
    ],
    skipDuplicates: true,
  });

  // ✅ Seed Departments
  await prisma.department.createMany({
    data: [
      { name: "SALES" },
      { name: "TECH" },
      { name: "PURCHASE" },
      { name: "DELIVERY" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeding completed");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });