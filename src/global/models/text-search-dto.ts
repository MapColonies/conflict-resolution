import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, IsBooleanString } from 'class-validator';
import { Type } from "class-transformer";

import { PaginationQueryDto } from './pagination-query-dto';
import { MIN_SEARCH_LENGTH, MAX_SEARCH_LENGTH } from '../constants';

export class TextSearchDto {
    @ApiPropertyOptional({ type: String })
    @IsString()
    @MinLength(MIN_SEARCH_LENGTH)
    @MaxLength(MAX_SEARCH_LENGTH)
    @Type(() => String)
    text: string;
}

export class TextSearchPaginationDto extends IntersectionType(
    TextSearchDto,
    PaginationQueryDto
) { }

class Temp {
    @ApiPropertyOptional({ type: String })
    @IsString()
    @MinLength(MIN_SEARCH_LENGTH)
    @MaxLength(MAX_SEARCH_LENGTH)
    @Type(() => String)
    text: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBooleanString()
    includeConflict?: string;
};

export class ResolutionTextSearchDto extends IntersectionType(
    Temp,
    PaginationQueryDto
) { }

// NestJS missing feature / bug [too bad this does not work...]
// export class ResolutionTextSearch extends IntersectionType(
//     TextSearchPaginationDto,
//     PickType(ResolutionQueryDto, ['includeConflict'] as const)
// ) { }
