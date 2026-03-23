/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // --- TABLE: client_role ---
    await knex.schema.createTable("client_roles", (table) => {
        table.increments("id").primary();
        table.string("name", 255);
    });

    // --- TABLE: proses_client ---
    await knex.schema.createTable("proses_clients", (table) => {
        table
            .integer("pah_id")
            .unsigned()
            .references("id")
            .inTable("proses_alas_hak")
            .onDelete("CASCADE");
        table
            .integer("client_id")
            .unsigned()
            .references("id")
            .inTable("clients")
            .onDelete("CASCADE");
        table
            .integer("roles_id")
            .unsigned()
            .references("id")
            .inTable("client_roles")
            .onDelete("CASCADE");

        table.primary(["pah_id", "client_id"]);

        // indexes
        table.index("client_id");
        table.index("roles_id");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable("proses_clients");
    await knex.schema.dropTable("client_roles");
}
