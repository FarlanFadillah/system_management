/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("activity_logs", (table) => {
        table.increments("id").primary();
        table.integer("entity_id").unsigned().notNullable();
        table.string("entity_type").notNullable();
        table.string("desc").notNullable();
        table.enum("level", ["info", "warning", "error"]).defaultTo("info");
        table.timestamp("timestamp").notNullable();
        table.json("metadata");

        table.index(["entity_type", "entity_id"]);
        table.index("entity_id");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable("activity_logs");
}
