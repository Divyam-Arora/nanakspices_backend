import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";


const sql = postgres(Bun.env.DATABASE_URL as string, { max: 1 })
const db = drizzle(sql);

(async () => {
    await migrate(db, { migrationsFolder: "drizzle" });
    await sql.end();
})();
