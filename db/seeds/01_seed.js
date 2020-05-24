// FIXME: cannot find tableNames
// const tableNames = require('../../src/services/postgres/table-names.ts');
const conflicts = require('../sample-data');

const tableNames = {
  conflict: 'conflict',
  result: 'result' 
}

/**
 * @param {Knex} knex
 */
exports.seed = async (knex) => {
  await Promise.all(Object.keys(tableNames).map((name) =>
   knex(name).del()));

  await knex(tableNames.conflict).insert(conflicts);
};
