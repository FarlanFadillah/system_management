/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // --- TABLE: clients_alas_hak ---
    return knex.schema.createTable("alas_hak_clients", (table) => {
        table
            .integer("client_id")
            .unsigned()
            .references("id")
            .inTable("clients")
            .onDelete("CASCADE");
        table
            .integer("alas_hak_id")
            .unsigned()
            .references("id")
            .inTable("alas_hak")
            .onDelete("CASCADE");
        table.primary(["client_id", "alas_hak_id"]);

        // indexes
        table.index("alas_hak_id");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable("alas_hak_clients");
}
