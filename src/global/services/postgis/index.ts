import knexPostgis = require('knex-postgis');

import { db } from '../postgres/db-connection';

// TODO: should create injectable postgis service from nest-knex?
export const postgis = knexPostgis(db);