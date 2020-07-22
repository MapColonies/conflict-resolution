import { ApiProperty, ApiPropertyOptional, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';

import { Conflict } from '../../conflicts/models/conflict';
import { FullResolution } from '../../resolutions/models/full-resolution';
import { Resolution } from '../../resolutions/models/resolution';

@ApiExtraModels(FullResolution, Resolution)
export class PaginationResult<T> {
    @ApiProperty()
    currentPage: number;

    @ApiProperty()
    perPage: number;

    @ApiProperty()
    offset: number;

    @ApiPropertyOptional()
    total?: number;

    @ApiPropertyOptional()
    lastPage?: number;

    @ApiProperty({
        oneOf: [
            { $ref: getSchemaPath(Conflict) },
            { $ref: getSchemaPath(FullResolution) },
            { $ref: getSchemaPath(Resolution) }
        ],
        type: [Conflict, FullResolution, Resolution]
    })
    data: [Conflict] | [FullResolution] | [Resolution]

    @ApiPropertyOptional()
    from?: number;

    @ApiPropertyOptional()
    to?: number;
}