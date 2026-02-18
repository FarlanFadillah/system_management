const dotenv = require("dotenv").config({ path: "../.env" });
const path = require("path");
const process = require("process");

module.exports = {
    development: {
        client: process.env.DB_CLIENT,
        connection: {
            filename: path.join("..", process.env.DB_FILENAME),
            timezone: "UTC",
        },
        useNullAsDefault: true,
        migrations: {
            directory: "../migrations",
        },
    },
};
