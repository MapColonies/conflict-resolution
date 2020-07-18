import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from "class-transformer";

import { minPage, maxPerPage, minPerPage, defaultPerPage } from '../constants';

export class PaginationQueryDto {
    @ApiPropertyOptional({ default: minPage })
    @IsOptional()
    @IsInt()
    @Min(minPage)
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