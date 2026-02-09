import knex from "knex";

const db = knex({
    client : "sqlite3",
    connection : {
        filename : "./dbs/main.sqlite3",
        timezone : "UTC"
    },
    useNullAsDefault : true
});

db.raw("PRAGMA foreign_key= ON").then(()=>{
    console.log("SQLite foreign key enabled")
})

export {db as default}