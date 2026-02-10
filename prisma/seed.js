const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "password123",
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
