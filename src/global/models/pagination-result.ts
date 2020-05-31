import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';

import { Conflict } from '../../conflicts/models/conflict';
import { FullResult } from 'src/results/models/full-result';

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
            { $ref: getSchemaPath(FullResult) }
        ],
        type: [Conflict, FullResult]
    })
    data: [Conflict] | [FullResult]

    @ApiPropertyOptional()
    from?: number;

    @ApiPropertyOptional()
    to?: number;
}