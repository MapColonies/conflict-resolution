/* eslint-disable @typescript-eslint/no-var-requires */
const Knex = require('knex');

const { onUpdateTrigger } = require('../../knexfile');

const tableNames = {
  conflict: 'conflict',
  result: 'result' 
}
// FIXME: cannot find tableNames
// const { tableNames } = require('../../src/services/postgres/table-names');
const {
  ON_UPDATE_TIMESTAMP_FUNCTION,
  DROP_ON_UPDATE_TIMESTAMP_FUNCTION,
  CREATE_INDEX,
  DROP_INDEX
} = require('../../src/global/services/postgres/migration/custom-functions');
const {
  addDefaultColumns,
  createReference,
  rollbackDropReference,
  rollbackDropIndex
} = require('../../src/global/services/postgres/migration/table-utils');

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);  
  await Promise.all([
    knex.schema
      .createTable(tableNames.conflict, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('requesting_server').notNullable();
        table.string('requested_server').notNullable();
        table.jsonb('requesting_entity').notNullable();
        table.jsonb('requested_entity').notNullable();
        table.string('description', 1000);
        table.boolean('has_resolved').defaultTo(false);
        table.datetime('resolved_at');
        table.specificType('location', 'geometry(point, 4326)');
        createReference(table, tableNames.result, 'set null', true);
        addDefaultColumns(table);
      })
      .then(() => knex.raw(onUpdateTrigger(tableNames.conflict))),
    knex.schema
      .createTable(tableNames.result, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('result_server').notNullable();
        table.jsonb('result_entity').notNullable();
        table.uuid('resolved_by_id');
        table.string('resolved_by');
        createReference(table, tableNames.conflict, 'cascade', false);
        addDefaultColumns(table);
      })
      .then(() => knex.raw(onUpdateTrigger(tableNames.result))),
  ]);
  await knex.raw(CREATE_INDEX(tableNames.conflict, 'requesting_entity', 'idx_conflict_requesting_entity_full_text'));
  await knex.raw(CREATE_INDEX(tableNames.conflict, 'requested_entity', 'idx_conflict_requested_entity_full_text'));
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw(DROP_INDEX('idx_conflict_requesting_entity_full_text'));
  await knex.raw(DROP_INDEX('idx_conflict_requested_entity_full_text'));
  await rollbackDropReference(
    knex,
    tableNames.conflict,
    `${tableNames.result}_id`
  );
  await rollbackDropReference(
    knex,
    tableNames.result,
    `${tableNames.conflict}_id`
  );
  await Promise.all(
    [tableNames.result, tableNames.conflict].map((tableName) =>
      knex.schema.dropTableIfExists(tableName)
    )
  );
  await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
  await knex.raw('drop extension if exists "uuid-ossp"');
};
