/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tenants', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.text('name');
    t.jsonb('g_credentials');
    t.jsonb('g_token');
    t.text('api_key').unique();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tenants');
};
