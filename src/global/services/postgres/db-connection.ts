import knex = require('knex');

import { NODE_ENV } from '../../../config/app-conflig';
import knexConfig = require('../../../../knexfile');

export const db = knex(knexConfig[NODE_ENV]);