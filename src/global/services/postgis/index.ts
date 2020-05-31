import knexPostgis = require('knex-postgis');

import { db } from '../postgres/db-connection';

export const postgis = knexPostgis(db);