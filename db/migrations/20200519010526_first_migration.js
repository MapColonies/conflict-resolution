const Knex = require('knex');

const { onUpdateTrigger } = require('../../knexfile');
const tableNames = require('../../src/global/services/postgres/migration/table-names');
const {
  ON_UPDATE_TIMESTAMP_FUNCTION,
  DROP_ON_UPDATE_TIMESTAMP_FUNCTION,
  CREATE_INDEX,
  DROP_INDEX
} = require('../../src/global/services/postgres/migration/custom-functions');
const {
  addDefaultColumns,
  createReference,
  rollbackDropReference
} = require('../../src/global/services/postgres/migration/table-utils');

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);  
  await Promise.all([
    knex.schema
      .createTable(tableNames.conflicts, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('source_server').notNullable();
        table.string('target_server').notNullable();
        table.jsonb('source_entity').notNullable();
        table.jsonb('target_entity').notNullable();
        table.string('description', 1000);
        table.boolean('has_resolved').defaultTo(false);
        table.datetime('resolved_at');
        table.specificType('location', 'geometry(point, 4326)');
        createReference(table, tableNames.results, 'set null', true);
        addDefaultColumns(table);
      })
      .then(() => knex.raw(onUpdateTrigger(tableNames.conflicts))),
    knex.schema
      .createTable(tableNames.results, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('result_server').notNullable();
        table.jsonb('result_entity').notNullable();
        table.uuid('resolved_by_id');
        table.string('resolved_by');
        createReference(table, tableNames.conflicts, 'cascade', false);
        addDefaultColumns(table);
      })
      .then(() => knex.raw(onUpdateTrigger(tableNames.results))),
  ]);
  await knex.raw(CREATE_INDEX(tableNames.conflicts, 'source_entity', 'idx_conflict_source_entity_full_text'));
  await knex.raw(CREATE_INDEX(tableNames.conflicts, 'target_entity', 'idx_conflict_target_entity_full_text'));
};

// TODO: convert plural names to singular

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw(DROP_INDEX('idx_conflict_source_entity_full_text'));
  await knex.raw(DROP_INDEX('idx_conflict_target_entity_full_text'));
  await rollbackDropReference(
    knex,
    tableNames.conflicts,
    // `${tableNames.results}_id`
    'result_id'
  );
  await rollbackDropReference(
    knex,
    tableNames.results,
    // `${tableNames.conflicts}_id`
    'conflict_id'
  );
  await Promise.all(
    [tableNames.results, tableNames.conflicts].map((tableName) =>
      knex.schema.dropTableIfExists(tableName)
    )
  );
  await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
  await knex.raw('drop extension if exists "uuid-ossp"');
};
