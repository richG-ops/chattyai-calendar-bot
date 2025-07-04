const knex = require('knex')(require('../knexfile'));

module.exports = {
  findByApiKey: (api_key) => knex('tenants').where({ api_key }).first(),
  createTenant: (tenant) => knex('tenants').insert(tenant).returning('*'),
};