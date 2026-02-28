import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/modules/auth/password";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await hashPassword("password123");

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      password: adminPasswordHash,
    },
    create: {
      username: "admin",
      password: adminPasswordHash,
      realName: "Administrador del Sistema",
      companies: {
        create: {
          company: {
            create: {
              name: "Empresa Demo S.A.",
              rif: "J-12345678-9",
              address: "Av. Principal, Caracas, Venezuela",
              databaseUrl: "file:./tenant_demo.db",
            },
          },
          role: "admin",
        },
      },
    },
  });

  console.log("Seed completado. Usuario creado:", admin.username);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
