export enum OrderByTypes {
    CONFLICT_ID = 'conflicts.id',
    CONFLICT_CREATED_AT = 'conflicts.created_at',
    CONFLICT_UPDATED_AT = 'conflicts.updated_at',
    CONFLICT_DELETED_AT = 'conflicts.deleted_at',
    CONFLICT_RESOLVED_AT = 'conflicts.resolved_at',
    CONFLICT_HAS_RESOLVED = 'conflicts.has_resolved',
    CONFLICT_DESCRIPTION = 'conflicts.description',
    CONFLICT_SOURCE_SERVER = 'conflicts.source_server',
    CONFLICT_TARGET_SERVER = 'conflicts.target_server',
    CONFLICT_SOURCE_CHANGE_TYPE = 'conflicts.source_change_type',
    CONFLICT_TARGET_CHANGE_TYPE = 'conflicts.target_change_type',
    RESOLUTION_ID = 'resolutions.id',
    RESOLUTION_SERVER = 'resolutions.resolution_server',
    RESOLUTION_RESOLVED_BY = 'resolutions.resolved_by',
    RESOLUTION_RESOLVED_BY_ID = 'resolutions.resolved_by_id',
    RESOLUTION_CREATED_AT = 'resolutions.created_at',
    RESOLUTION_UPDATED_AT = 'resolutions.updated_at'
}

export enum ExposedOrderByTypes {
    CONFLICT_ID = 'CONFLICT_ID',
    CONFLICT_CREATED_AT = 'CONFLICT_CREATED_AT',
    CONFLICT_UPDATED_AT = 'CONFLICT_UPDATED_AT',
    CONFLICT_DELETED_AT = 'CONFLICT_DELETED_AT',
    CONFLICT_RESOLVED_AT = 'CONFLICT_RESOLVED_AT',
    CONFLICT_HAS_RESOLVED = "CONFLICT_HAS_RESOLVED",
    CONFLICT_DESCRIPTION = "CONFLICT_DESCRIPTION",
    CONFLICT_SOURCE_SERVER = "CONFLICT_SOURCE_SERVER",
    CONFLICT_TARGET_SERVER = "CONFLICT_TARGET_SERVER",
    CONFLICT_SOURCE_CHANGE_TYPE = "CONFLICT_SOURCE_CHANGE_TYPE",
    CONFLICT_TARGET_CHANGE_TYPE = "CONFLICT_TARGET_CHANGE_TYPE",
    RESOLUTION_ID = "RESOLUTION_ID",
    RESOLUTION_SERVER = "RESOLUTION_SERVER",
    RESOLUTION_RESOLVED_BY = "RESOLUTION_RESOLVED_BY",
    RESOLUTION_RESOLVED_BY_ID = "RESOLUTION_RESOLVED_BY_ID",
    RESOLUTION_CREATED_AT = "RESOLUTION_CREATED_AT",
    RESOLUTION_UPDATED_AT = "RESOLUTION_UPDATED_AT",
}

export enum SortByTypes {
    ASC = 'asc',
    DESC = 'desc'
}