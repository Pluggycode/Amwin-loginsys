import {prisma } from "../lib/prisma";

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "ADMIN" },
      { name: "SALES" },
      { name: "TECH" },
    ],
    skipDuplicates: true,
  });

  console.log("Roles seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());