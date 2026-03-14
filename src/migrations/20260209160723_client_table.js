/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // --- TABLE: clients ---
    return knex.schema.createTable("clients", (table) => {
        table.increments("id").primary();
        table.string("nik", 255).unique().notNullable();
        table.string("first_name", 255).notNullable();
        table.string("last_name", 255);
        table.date("birth_date").notNullable();
        table.string("birth_place", 255).notNullable();
        table.string("job_name", 255).notNullable();
        table.string("address", 255);
        table.string("address_code", 255).notNullable();
        table.string("rt", 255);
        table.string("rw", 255);
        table.string("phone_number", 20);
        table.datetime("created_at").defaultTo(knex.fn.now());
        table.datetime("updated_at").defaultTo(knex.fn.now());
        table
            .enu("marriage_status", [
                "kawin",
                "belum kawin",
                "cerai hidup",
                "cerai mati",
            ])
            .notNullable();
        table.enu("gender", ["pria", "wanita"]).notNullable();

        // indexes
        table.index(["first_name", "last_name"]);
        table.index("first_name");
        table.index("last_name");
        table.index("address_code");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable("clients");
}
