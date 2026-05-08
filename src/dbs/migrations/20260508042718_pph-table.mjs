/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("pph", (table) => {
        table.increments("id").primary();
        table.string("code").unique();
        table.datetime("date");
        table.bigInteger("total");
        table.datetime("paid_date");
        table
            .integer("case_id")
            .references("id")
            .inTable("cases")
            .onDelete("SET NULL");
        table
            .integer("client_id")
            .references("id")
            .inTable("clients")
            .onDelete("SET NULL");

        table.index(["case_id", "client_id"]);
        table.index("client_id");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable("pph");
}
