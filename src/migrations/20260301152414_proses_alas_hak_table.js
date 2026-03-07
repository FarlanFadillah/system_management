/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // --- TABLE: produk ---
    await knex.schema.createTable("produk", (table) => {
        table.increments("id").primary();
        table.string("desc", 20);
    });

    const enumStatus = ["DRAFT", "PENDING", "ON PROCESS", "DONE"];

    // --- TABLE: proses_alas_hak ---
    await knex.schema.createTable("proses_alas_hak", (table) => {
        // columns nullable
        table.increments("id").primary();
        table.string("no_surat", 50).unique();
        table.date("tgl_surat");
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.datetime("updated_at").defaultTo(knex.fn.now());

        // columns not nullable
        table.enu("status", enumStatus).notNullable();

        // foreign keys
        table
            .integer("produk_id")
            .unsigned()
            .references("id")
            .inTable("produk")
            .onDelete("SET NULL");
        table
            .integer("alas_hak_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("alas_hak")
            .onDelete("CASCADE");

        // indexes
        table.index("tgl_surat");
        table.index("produk_id");
        table.index("alas_hak_id");
        table.index("status");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable("produk");
    await knex.schema.dropTable("proses_alas_hak");
};
