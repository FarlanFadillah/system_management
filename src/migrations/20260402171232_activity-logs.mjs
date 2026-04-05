/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("activity_logs", (table) => {
        table.increments("id").primary();
        table
            .integer("case_id")
            .unsigned()
            .references("id")
            .inTable("cases")
            .onDelete("CASCADE");
        table.string("action").notNullable();
        table.enum("level", ["info", "warning", "error"]).defaultTo("info");
        table.timestamp("timestamp").defaultTo(knex.fn.now());

        table.index("case_id");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable("activity_logs");
}
