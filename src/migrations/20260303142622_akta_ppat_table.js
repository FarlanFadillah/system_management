/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // --- TABLE: akta_ppat ---
    return knex.schema.createTable("akta_ppat", (table) => {
        // columns
        table.increments("id").primary();
        table.string("number", 50);
        table.string("year", 4);
        table.date("date");
        table.timestamps(true, true);

        table.unique(["number", "year"]);
        // foreign keys
        table
            .integer("case_id")
            .unsigned()
            .references("id")
            .inTable("cases")
            .onDelete("SET NULL")
            .nullable();
        table
            .integer("prd_id")
            .unsigned()
            .references("id")
            .inTable("products")
            .onDelete("SET NULL");
        // indexes
        table.index("case_id");
        table.index("prd_id");
        table.index("number");
        table.index("date");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable("akta_ppat");
}
