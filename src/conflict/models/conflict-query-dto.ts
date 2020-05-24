import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsBooleanString, IsString } from 'class-validator';
import { Type } from "class-transformer";

import { PaginationQueryDto } from '../../global/models/pagination-query-dto';

export class ConflictQueryDto extends PartialType(PaginationQueryDto){
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    from?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    to?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    coordinates?: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @Type(() => String)
    keywords?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBooleanString()
    resolved?: boolean;
}