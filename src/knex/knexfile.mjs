import process from "process";
import dotenv from "dotenv";
dotenv.config({
    path: `../../.env.${process.env.NODE_ENV || "development"}`,
});

console.log(process.env.DB_NAME);

export default {
    development: {
        client: process.env.DB_CLIENT,
        connection: {
            host: process.env.DP_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            timezone: "Z",
        },
        useNullAsDefault: true,
        migrations: {
            directory: "../migrations",
        },
    },
};
