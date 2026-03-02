import { db } from "./src/lib/orm";

async function list() {
    const companies = await db.company.findMany();
    console.log("Companies:", companies.map(c => ({ id: c.id, name: c.name, db: c.databaseUrl })));
}

list();
