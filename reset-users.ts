import { db } from "./src/lib/orm";

async function main() {
    await db.userCompany.deleteMany({
        where: {
            user: {
                username: { not: "admin" }
            }
        }
    });

    await db.user.deleteMany({
        where: {
            username: { not: "admin" }
        }
    });

    console.log("Usuarios eliminados, excepto admin.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
