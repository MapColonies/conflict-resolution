const pluralize = require('pluralize');

const addDefaultColumns = table => {
  table.timestamps(false, true);
  table.datetime('deleted_at');
};

const createDummyTable = (knex, tableName) => {
  return knex.schema.createTable(tableName, table => {
    table.increments().notNullable();
    addDefaultColumns(table);
  });
};

const createReference = (
  table,
  tableName,
  deleteFunc = 'set null',
  nullable = false,
  columnName = '',
) => {
  const definition = table
    .uuid(`${columnName || convertToSingular(tableName)}_id`)
    .references('id')
    .inTable(tableName)
    .onDelete(deleteFunc);

  if (!nullable) {
    definition.notNullable();
  }
  return definition;
};

const rollbackDropReference = async (knex, tableName, foreignKey) => {
  const fkName = `${convertToSingular(foreignKey)}_id`;
  await knex.schema.table(tableName, async t => {
    t.dropForeign(fkName);
    t.dropColumn(fkName);
  });
};

const rollbackDropIndex = async (
  knex,
  tableName,
  columnName,
  indexName = null,
) => {
  await knex.schema.table(tableName, async t => {
    t.dropIndex(columnName, indexName);
  });
};

const convertToSingular = word => {
  return pluralize.singular(word);
}

module.exports = {
  addDefaultColumns,
  createDummyTable,
  createReference,
  rollbackDropReference,
  rollbackDropIndex,
};
