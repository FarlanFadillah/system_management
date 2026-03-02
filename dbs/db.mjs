import knex from "knex";
import process from "process";
const db = knex({
    client: process.env.DB_CLIENT,
    connection: {
        host: process.env.DP_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        filename: process.env.DB_FILENAME,
        timezone: "UTC",
    },
    useNullAsDefault: true,
});

// FOR SQLITE3
// db.raw("PRAGMA foreign_key= ON").then(() => {
//     console.log("SQLite foreign key enabled");
// });

export { db as default };
