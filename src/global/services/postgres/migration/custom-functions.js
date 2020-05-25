exports.ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const TEXT_SEARCH_VECTOR_TYPE = 'English';
exports.TEXT_SEARCH_VECTOR_TYPE = TEXT_SEARCH_VECTOR_TYPE;

exports.CREATE_INDEX = (tableName, columnName, indexName = null, tsvectorType = TEXT_SEARCH_VECTOR_TYPE) => `CREATE INDEX ${indexName}
ON ${tableName} 
USING gist ( (to_tsvector('${tsvectorType}', ${columnName}::text))) ;`

exports.DROP_INDEX = (indexName) => `
  DROP INDEX ${indexName} ;
`;

exports.DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;
