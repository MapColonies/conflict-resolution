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

export const CONFLICTS_ORDER_BY_COLUMNS = [OrderByTypes.conflictId, OrderByTypes.conflictCreatedAt, OrderByTypes.conflictLastUpdatedAt, OrderByTypes.conflictDeletedAt,
OrderByTypes.conflictResolvedAt, OrderByTypes.conflictHasResolved, OrderByTypes.conflictDescripton,
OrderByTypes.conflictSourceServer, OrderByTypes.conflictTargetServer, OrderByTypes.conflictSourceChangeType, OrderByTypes.conflictTargetChangeType];

export const RESOLUTIONS_ORDER_BY_COLUMNS = [OrderByTypes.resolutionId,
OrderByTypes.resolutionServer, OrderByTypes.resolutionResolvedBy, OrderByTypes.resolutionResolvedById, OrderByTypes.resolutionCreatedAt, OrderByTypes.resolutionLastUpdatedAt];

export const ORDER_BY_TABLE_COLUMNS = {
  conflicts: CONFLICTS_ORDER_BY_COLUMNS,
  resolutions: RESOLUTIONS_ORDER_BY_COLUMNS
}