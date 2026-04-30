/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("owner_histories", (table) => {
        table
            .integer("ah_id")
            .unsigned()
            .references("id")
            .inTable("alas_hak")
            .onDelete("SET NULL");
        table
            .integer("client_id")
            .unsigned()
            .references("id")
            .inTable("clients")
            .onDelete("SET NULL");
        table
            .integer("case_id")
            .unsigned()
            .references("id")
            .inTable("cases")
            .onDelete("SET NULL");
        table.datetime("start_date");
        table.datetime("end_date").defaultTo(knex.fn.now());
        table.string("acq_type");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable("owner_histories");
}
