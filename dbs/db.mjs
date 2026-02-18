import knex from "knex";
import process from "process";
const db = knex({
    client: process.env.DB_CLIENT,
    connection: {
        filename: process.env.DB_FILENAME,
        timezone: "UTC",
    },
    useNullAsDefault: true,
});

db.raw("PRAGMA foreign_key= ON").then(() => {
    console.log("SQLite foreign key enabled");
});

export { db as default };
