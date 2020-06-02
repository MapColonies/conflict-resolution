import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';

import { Conflict } from '../../conflicts/models/conflict';
import { FullResolution } from 'src/resolutions/models/full-resolution';

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
            { $ref: getSchemaPath(FullResolution) }
        ],
        type: [Conflict, FullResolution]
    })
    data: [Conflict] | [FullResolution]

    @ApiPropertyOptional()
    from?: number;

    @ApiPropertyOptional()
    to?: number;
}