require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.APP_HOST,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: +process.env.POSTGRES_PORT
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  onUpdateTrigger: table => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
    `
};

/*
Migrations:
knex init
knex migrate:make migration_name
knex migrate:make migration_name -x ts # Generates a TypeScript migration file
knex migrate:latest
knex migrate:rollback

Seesd:
knex seed:make seed_name
knex seed:make seed_name -x ts # Generates a TypeScript seed file
knex seed:run # Runs all seed files
knex seed:run --specific=seed-filename.js # Runs a specific seed file
*/