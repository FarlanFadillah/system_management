/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").notNullable().primary();
        table.string("username").unique().notNullable();
        table.string("hash").notNullable();
        table.string("email");
        table.string("first_name").notNullable();
        table.string("last_name");
        table.enum("role", ["superuser", "admin", "guest"]).defaultTo("guest");
    });

    // await knex.schema.createTable("provinsi", (table) => {
    //     table.string("id").primary();
    //     table.string("name").notNullable();
    // });

    // await knex.schema.createTable("kabupaten", (table) => {
    //     table.string("id").primary();
    //     table
    //         .string("id_provinsi")
    //         .references("id")
    //         .inTable("provinsi")
    //         .onDelete("CASCADE");
    //     table.string("name").notNullable();
    // });

    // await knex.schema.createTable("kecamatan", (table) => {
    //     table.string("id").primary();
    //     table
    //         .string("id_kabupaten")
    //         .references("id")
    //         .inTable("kabupaten")
    //         .onDelete("CASCADE");
    //     table.string("name").notNullable();
    // });

    // await knex.schema.createTable("kelurahan", (table) => {
    //     table.string("id").primary();
    //     table
    //         .string("id_kecamatan")
    //         .references("id")
    //         .inTable("kecamatan")
    //         .onDelete("CASCADE");
    //     table.string("name").notNullable();
    // });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // await knex.schema.dropTable("kelurahan");
    // await knex.schema.dropTable("kecamatan");
    // await knex.schema.dropTable("kabupaten");
    // await knex.schema.dropTable("provinsi");
    await knex.schema.dropTable("users");
}
