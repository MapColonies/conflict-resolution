export enum OrderByTypes {
    conflictId = 'conflicts.id',
    conflictCreatedAt = 'conflicts.created_at',
    conflictLastUpdatedAt = 'conflicts.updated_at',
    conflictDeletedAt = 'conflicts.deleted_at',
    conflictResolvedAt = 'conflicts.resolved_at',
    conflictHasResolved = 'conflicts.has_resolved',
    conflictDescripton = 'conflicts.description',
    conflictSourceServer = 'conflicts.source_server',
    conflictTargetServer = 'conflicts.target_server',
    conflictSourceChangeType = 'conflicts.source_change_type',
    conflictTargetChangeType = 'conflicts.target_change_type',
    resolutionId = 'resolutions.id',
    resolutionServer = 'resolutions.resolution_server',
    resolutionResolvedBy = 'resolutions.resolved_by',
    resolutionResolvedById = 'resolutions.resolved_by_id',
    resolutionCreatedAt = 'resolutions.created_at',
    resolutionLastUpdatedAt = 'resolutions.updated_at'
}

export enum SortByTypes {
    ASC = 'asc',
    DESC = 'desc'
}

// only for swagger doc
export enum AllOrderByTypes {
    CONFLICT_CREATED_AT = 'conflictCreatedAt',
    CONFLICT_UPDATED_AT = 'conflictLastUpdatedAt',
    CONFLICT_DELETED_AT = 'conflictDeletedAt',
    CONFLICT_RESOLVED_AT = 'conflictResolvedAt',
    CONFLICT_HAS_RESOLVED = "conflictHasResolved",
    CONFLICT_DESCRIPTION = "conflictDescripton",
    CONFLICT_SOURCE_SERVER = "conflictSourceServer",
    CONFLICT_TARGET_SERVER = "conflictTargetServer",
    CONFLICT_SOURCE_CHANGE_TYPE = "conflictSourceChangeType",
    CONFLICT_TARGET_CHANGE_TYPE = "conflictTargetChangeType",
    RESOLUTION_SERVER = "resolutionServer",
    RESOLUTION_RESOLVED_BY = "resolutionResolvedBy",
    RESOLUTION_CREATED_AT = "resolutionCreatedAt",
    RESOLUTION_UPDATED_AT = "resolutionLastUpdatedAt",
}
