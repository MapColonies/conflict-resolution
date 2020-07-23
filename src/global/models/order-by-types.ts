export enum OrderByTypes {
    conflictId = 'conflicts.id',
    conflictCreatedAt = 'conflicts.createdAt',
    conflictLastUpdatedAt = 'conflicts.updatedAt',
    conflictDeletedAt = 'conflicts.deletedAt',
    conflictResolvedAt = 'conflicts.resolvedAt',
    conflictHasResolved = 'conflicts.hasResolved',
    conflictDescripton = 'conflicts.description',
    conflictSourceServer = 'conflicts.sourceServer',
    conflictTargetServer = 'conflicts.targetServer',
    conflictSourceChangeType = 'conflicts.sourceChangeType',
    conflictTargetChangeType = 'conflicts.targetChangeType',
    resolutionId = 'resolutions.id',
    resolutionServer = 'resolutions.resolutionServer',
    resolutionResolvedBy = 'resolutions.resolvedBy',
    resolutionResolvedById = 'resolutions.resolvedById',
    resolutionCreatedAt = 'resolutions.createdAt',
    resolutionLastUpdatedAt = 'resolutions.updatedAt'
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
