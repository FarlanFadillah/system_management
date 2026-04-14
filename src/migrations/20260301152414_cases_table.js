/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // --- TABLE: produk ---
    await knex.schema.createTable("products", (table) => {
        table.increments("id").primary();
        table.string("name", 20);
    });

    const enumStatus = ["DRAFT", "PENDING", "IN PROGRESS", "DONE", "REJECTED"];

    // --- TABLE: proses_alas_hak ---
    await knex.schema.createTable("cases", (table) => {
        // columns nullable
        table.increments("id").primary();
        table.string("code", 5).unique();
        table.date("completed_at");
        table.timestamps(true, true);

        // columns not nullable
        table.enu("status", enumStatus).notNullable();

        // foreign keys
        table
            .integer("prd_id")
            .unsigned()
            .references("id")
            .inTable("products")
            .onDelete("SET NULL");
        table
            .integer("ah_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("alas_hak")
            .onDelete("CASCADE");

        // indexes
        table.index("code");
        table.index("prd_id");
        table.index("ah_id");
        table.index("status");
    });

    await knex.schema.createTable("workflows", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.integer("order").unsigned().notNullable();
        table.string("version").notNullable().defaultTo("v1");
        table.json("required_fields").defaultTo(null);
        table
            .integer("prd_id")
            .unsigned()
            .references("id")
            .inTable("products")
            .onDelete("SET NULL");

        table.index("prd_id");
    });

    await knex.schema.createTable("case_steps", (table) => {
        table.increments("id").primary();
        table
            .integer("case_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("cases")
            .onDelete("CASCADE");

        table
            .integer("step_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("workflows")
            .onDelete("CASCADE");

        table.enum("status", enumStatus);
        table.string("note");
        table.timestamp("started_at").defaultTo(knex.fn.now());
        table.timestamp("completed_at");

        table.index(["case_id", "step_id"]);
    });

    await knex.schema.alterTable("cases", (table) => {
        table
            .integer("current_step")
            .unsigned()
            .references("id")
            .inTable("case_steps")
            .onDelete("SET NULL");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("cases", (table) => {
        table.dropForeign("current_step");
        table.dropColumn("current_step");
    });
    await knex.schema.dropTable("case_steps");
    await knex.schema.dropTable("workflows");
    await knex.schema.dropTable("cases");
    await knex.schema.dropTable("products");
}
