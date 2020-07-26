import { ApiPropertyOptional, IntersectionType, ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';
import { Type, Transform } from "class-transformer";

import { PaginationQueryDto } from './pagination-query-dto';
import { MIN_SEARCH_LENGTH, MAX_SEARCH_LENGTH } from '../constants';

export class TextSearchDto {
    @ApiProperty({ type: String })
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

// due to nestjs bug: https://github.com/typestack/class-transformer/issues/306
export const ToBoolean = () => {
    return Transform(value => ["1", 1, "true", true].includes(value));
}

class Temp {
    @ApiProperty({ type: String })
    @IsString()
    @MinLength(MIN_SEARCH_LENGTH)
    @MaxLength(MAX_SEARCH_LENGTH)
    @Type(() => String)
    text: string;

    @ApiPropertyOptional()
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    includeConflict?: boolean;
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
