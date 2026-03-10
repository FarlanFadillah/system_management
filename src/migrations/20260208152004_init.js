/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").notNullable().primary();
        table.string("username").unique().notNullable();
        table.string("hash").notNullable();
        table.string("email");
        table.string("first_name").notNullable();
        table.string("last_name");
        table.enum("role", ["superuser", "admin", "guest"]).defaultTo("guest");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable("users");
}
