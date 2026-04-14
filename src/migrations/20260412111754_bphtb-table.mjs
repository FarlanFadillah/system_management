/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // --- TABLE: bphtb ---
    const enumStatus = [
        "DRAFT",
        "BERKAS_MASUK",
        "SURVEI",
        "PERINTAH_BAYAR",
        "DIBAYAR",
    ];
    await knex.schema.createTable("bphtb", (table) => {
        // columns
        table.increments("id").primary();
        table.bigInteger("hasil_survei");

        table.timestamps(true, true);

        table.date("tgl_berkas_masuk");
        table.date("tgl_survei");
        table.date("tgl_perintah_bayar");
        table.date("tgl_bayar");

        table.enum("status", enumStatus).defaultTo(enumStatus[0]);
        table.string("catatan", 255);

        // foreign keys
        table
            .integer("case_id")
            .unsigned()
            .references("id")
            .inTable("cases")
            .onDelete("SET NULL");
        table
            .integer("ah_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("alas_hak")
            .onDelete("CASCADE");
        table
            .integer("prd_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("products");
        table
            .integer("client_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("clients")
            .onDelete("CASCADE");

        // indexes
        table.index(["client_id", "ah_id"]);
        table.index("case_id");
        table.index("client_id");
        table.index("ah_id");
        table.index("prd_id");
        table.index("tgl_survei");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable("bphtb");
}
