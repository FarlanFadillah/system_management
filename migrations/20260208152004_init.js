/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").notNullable().primary();
        table.string("username").unique().notNullable();
        table.string("hash").notNullable();
        table.string("email");
        table.string("first_name").notNullable();
        table.string("last_name");
        table.enum("role", ["superuser", "admin", "guest"]).defaultTo("guest");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
