import knex from "knex";

const db = knex({
    client : "sqlite3",
    connection : {
        filename : "./dbs/main.sqlite3",
        timezone : "UTC"
    },
    useNullAsDefault : true
});

export {db as default}