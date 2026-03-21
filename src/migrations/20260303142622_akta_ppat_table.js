/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // --- TABLE: akta_ppat ---
    return knex.schema.createTable("akta_ppat", (table) => {
        // columns
        table.increments("id").primary();
        table.string("no_akta", 50);
        table.string("tahun_akta", 4);
        table.date("tgl_akta");
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.datetime("updated_at").defaultTo(knex.fn.now());

        table.unique(["no_akta", "tahun_akta"]);
        // foreign keys
        table
            .integer("proses_id")
            .unsigned()
            .references("id")
            .inTable("proses_alas_hak")
            .onDelete("SET NULL")
            .nullable();
        table
            .integer("produk_id")
            .unsigned()
            .references("id")
            .inTable("produk")
            .onDelete("SET NULL");
        // indexes
        table.index("proses_id");
        table.index("produk_id");
        table.index("no_akta");
        table.index("tgl_akta");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable("akta_ppat");
}
