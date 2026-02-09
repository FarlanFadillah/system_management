/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // --- TABLE: clients ---
  knex.schema.createTable('clients', (table) => {
    // columns nullable
    table.increments('id').primary();
    table.string('nik', 255).unique();
    table.string('first_name', 255);
    table.string('last_name', 255);
    table.date('birth_date');
    table.string('birth_place', 255);
    table.string('job_name', 255);
    table.string('address', 255);
    table.string('address_code', 255);
    table.string('rt', 255);
    table.string('rw', 255);
    table.string('phone_number', 20);
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());
    
    // columns not nullable
    table.enu('marriage_status', enumMarriageStatus).notNullable();
    table.enu('gender', enumGender).notNullable();

    // indexes
    table.index(['first_name', 'last_name']);
    table.index('first_name');
    table.index('last_name');
    table.index('address_code');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.dropTable("clients");
};
