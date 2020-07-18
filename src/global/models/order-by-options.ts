import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBooleanString } from 'class-validator';
import { Type } from "class-transformer";

enum OrderByTypes {
    CONFLICT_ID='conflicts.id',
    CONFLICT_CREATED_AT='conflicts.created_at',
    CONFLICT_UPDATED_AT='conflicts.updated_at',
    CONFLICT_DELETED_AT='conflicts.deleted_at',
    CONFLICT_RESOLVED_AT='conflicts.resolved_at',
    CONFLICT_HAS_RESOLVED='conflicts.has_resolved',
    CONFLICT_RESOLVED_BY='conflicts.resolved_by',
    CONFLICT_DESCRIPTION='conflicts.description',
    CONFLICT_SOURCE_SERVER='conflicts.source_server',
    CONFLICT_TARGET_SERVER='conflicts.target_server',
    CONFLICT_SOURCE_CHANGE_TYPE='conflicts.source_change_type',
    CONFLICT_TARGET_CHANGE_TYPE='conflicts.target_change_type',
    RESOLUTION_ID='resolutions.id',
    RESOLUTION_SERVER='resolutions.resolution_server',
    RESOLUTION_CREATED_AT='resolutions.created_at',
    RESOLUTION_UPDATED_AT='resolutions.updated_at'
}

const conflictsOrderByColumns = [OrderByTypes.CONFLICT_ID, OrderByTypes.CONFLICT_CREATED_AT, OrderByTypes.CONFLICT_UPDATED_AT, OrderByTypes.CONFLICT_DELETED_AT,
OrderByTypes.CONFLICT_RESOLVED_AT, OrderByTypes.CONFLICT_HAS_RESOLVED, OrderByTypes.CONFLICT_RESOLVED_BY, OrderByTypes.CONFLICT_DESCRIPTION, 
OrderByTypes.CONFLICT_SOURCE_SERVER, OrderByTypes.CONFLICT_TARGET_SERVER, OrderByTypes.CONFLICT_SOURCE_CHANGE_TYPE, OrderByTypes.CONFLICT_TARGET_CHANGE_TYPE];

const resolutionsOrderByColumns = [...conflictsOrderByColumns, OrderByTypes.RESOLUTION_ID,
     OrderByTypes.RESOLUTION_SERVER, OrderByTypes.RESOLUTION_CREATED_AT, OrderByTypes.RESOLUTION_UPDATED_AT];
     
const orderByTableColumns = {
    conflicts: conflictsOrderByColumns,
    resolutions: resolutionsOrderByColumns
}

export class OrderByOptions {
    constructor(columnName: string, isAscending: string, tableName: string) {
        this.columnName = OrderByTypes[columnName];
        this.isAscending = isAscending === 'true' ? true : isAscending === 'false' ? false : undefined;
        this.tableName = tableName;
    }

    @ApiPropertyOptional()
    @Type(() => String)
    columnName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBooleanString()
    isAscending?: boolean;

    tableName: string;

    isValid(tableName?: string): boolean {
        if (tableName && !this.tableName) {
            this.tableName = tableName
        }
        if (!orderByTableColumns[this.tableName]?.includes(this.columnName)) {
            return false;
        }
        if (this.isAscending === undefined) {
            this.isAscending = true;
        }
        return true;
    }
}