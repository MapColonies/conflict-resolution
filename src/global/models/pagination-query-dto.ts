import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from "class-transformer";

import { MIN_PAGE, MAX_PER_PAGE, MIN_PER_PAGE, DEFAULT_PER_PAGE } from '../constants';

export class PaginationQueryDto {
    @ApiPropertyOptional({ default: MIN_PAGE })
    @IsOptional()
    @IsInt()
    @Min(MIN_PAGE)
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional({ default: DEFAULT_PER_PAGE })
    @IsOptional()
    @IsInt()
    @Min(MIN_PER_PAGE)
    @Max(MAX_PER_PAGE)
    @Type(() => Number)
    limit?: number
}