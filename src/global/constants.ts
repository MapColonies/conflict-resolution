import { OrderByTypes } from '../global/models/order-by-types';

export const MIN_PAGE = 0;
export const DEFAULT_PER_PAGE = 10;
export const MIN_PER_PAGE = 1;
export const MAX_PER_PAGE = 100

export const MIN_SEARCH_LENGTH = 3;
export const MAX_SEARCH_LENGTH = 100;

export const MIN_KEYOWRD_LENGTH = 3;
export const KEYWORD_QUERY_COLUMNS = [
  'description',
  'source_server',
  'target_server',
];

export const CONFLICTS_ORDER_BY_COLUMNS = [OrderByTypes.CONFLICT_ID, OrderByTypes.CONFLICT_CREATED_AT, OrderByTypes.CONFLICT_UPDATED_AT, OrderByTypes.CONFLICT_DELETED_AT,
OrderByTypes.CONFLICT_RESOLVED_AT, OrderByTypes.CONFLICT_HAS_RESOLVED, OrderByTypes.CONFLICT_DESCRIPTION,
OrderByTypes.CONFLICT_SOURCE_SERVER, OrderByTypes.CONFLICT_TARGET_SERVER, OrderByTypes.CONFLICT_SOURCE_CHANGE_TYPE, OrderByTypes.CONFLICT_TARGET_CHANGE_TYPE];

export const RESOLUTIONS_ORDER_BY_COLUMNS = [OrderByTypes.RESOLUTION_ID,
OrderByTypes.RESOLUTION_SERVER, OrderByTypes.RESOLUTION_RESOLVED_BY, OrderByTypes.RESOLUTION_RESOLVED_BY_ID, OrderByTypes.RESOLUTION_CREATED_AT, OrderByTypes.RESOLUTION_UPDATED_AT];

export const ORDER_BY_TABLE_COLUMNS = {
  conflicts: CONFLICTS_ORDER_BY_COLUMNS,
  resolutions: RESOLUTIONS_ORDER_BY_COLUMNS
}