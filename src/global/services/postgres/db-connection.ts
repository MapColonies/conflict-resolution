import knex = require('knex');

import { NODE_ENV } from '../../../config/app-config';
import knexConfig = require('../../../../knexfile');

export const db = knex(knexConfig[NODE_ENV]);