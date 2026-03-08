import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/modules/auth/password";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await hashPassword("password123");

  // Create Default Profiles
  const profiles = [
    { name: "Administrador", description: "Acceso total a todas las funciones del sistema" },
    { name: "Desarrollador", description: "Acceso a funciones técnicas y personalización" },
    { name: "Operador", description: "Acceso limitado a operaciones diarias" },
  ];

  for (const p of profiles) {
    await prisma.profile.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  const adminProfile = await prisma.profile.findUnique({ where: { name: "Administrador" } });

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
          ...(adminProfile ? {
            profile: {
              connect: { id: adminProfile.id }
            }
          } : {})
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
