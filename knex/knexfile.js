module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "../dbs/main.sqlite3",
            timezone: "UTC",
        },
        useNullAsDefault: true,
        migrations: {
            directory: "../migrations",
        },
    },
};
