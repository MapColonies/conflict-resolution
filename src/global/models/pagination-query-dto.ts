import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min, Max } from 'class-validator';
import { Type } from "class-transformer";

import { maxPerPage, minPerPage } from './pagination-config';

export class PaginationQueryDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(minPerPage)
    @Max(maxPerPage)
    @Type(() => Number)
    limit?: number
}