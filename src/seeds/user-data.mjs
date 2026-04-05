/**
 *
 * @param {import("knex").Knex} knex
 * @returns { Promise<void> }
 */
export const seed = async (knex) => {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        /**
         * use this to login
         * {
         *    "username" : "alan",
         *    "password" : "290801"
         * }
         */
        {
            id: 1,
            username: "alan",
            hash: "$2b$10$BKxeCdDqIcpUKOJdG/cjzexzVaAkz8rYWEYACZAGgAHtytodwCooK",
            email: "farlanf61@gmail.com",
            first_name: "Farlan",
            last_name: "Fadillah",
            role: "superuser",
        },
        {
            id: 2,
            username: "adit",
            hash: "$2b$10$BKxeCdDqIcpUKOJdG/cjzexzVaAkz8rYWEYACZAGgAHtytodwCooK",
            email: "adit@gmail.com",
            first_name: "Adithya",
            last_name: "Fadillah",
            role: "admin",
        },
    ]);
};
