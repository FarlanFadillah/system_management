/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // --- TABLE: jenis_hak ---
    await knex.schema.createTable("jenis_hak", (table) => {
        table.increments("id").primary();
        table.string("desc", 20);
    });

    // --- TABLE: alas_hak ---
    await knex.schema.createTable("alas_hak", (table) => {
        // columns nullable
        table.increments("id").primary();
        table.string("no_alas_hak", 255).unique();
        table.string("jor", 255);
        table.date("tgl_alas_hak");
        table.string("no_surat_ukur", 255);
        table.date("tgl_surat_ukur");
        table.string("ket", 255);
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.datetime("updated_at").defaultTo(knex.fn.now());

        // columns not nullable
        table.integer("luas").notNullable();
        table.string("address_code", 20).notNullable();

        // foreign keys
        table
            .integer("jenis_hak_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("jenis_hak")
            .onDelete("CASCADE");

        // indexes
        table.index("jenis_hak_id");
        table.index("address_code");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable("jenis_hak");
    await knex.schema.dropTable("alas_hak");
}
