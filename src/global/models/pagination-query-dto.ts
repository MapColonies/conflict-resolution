import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min, Max } from 'class-validator';
import { Type } from "class-transformer";

import { maxPerPage, minPerPage, defaultPerPage } from './pagination-config';

export class PaginationQueryDto {

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional({ default: defaultPerPage })
    @IsOptional()
    @IsInt()
    @Min(minPerPage)
    @Max(maxPerPage)
    @Type(() => Number)
    limit?: number
}