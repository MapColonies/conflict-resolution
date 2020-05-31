const tableNames = require('../../src/global/services/postgres/migration/table-names');
const conflicts = require('../sample-data');

/**
 * @param {Knex} knex
 */
exports.seed = async (knex) => {
  await Promise.all(Object.keys(tableNames).map((name) =>
   knex(name).del()));

  await knex(tableNames.conflicts).insert(conflicts);
};
