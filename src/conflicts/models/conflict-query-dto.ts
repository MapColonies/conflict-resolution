import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsObject, ValidateNested, IsBoolean, IsArray, Min } from 'class-validator';
import { Type } from "class-transformer";

import { PaginationQueryDto } from '../../global/models/pagination-query-dto';
import { CustomGeoJson } from 'src/global/models/custom-geojson';

export class ConflictQueryDto extends PartialType(PaginationQueryDto){
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    from?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    to?: number;

    @ApiPropertyOptional({ type: () => CustomGeoJson })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CustomGeoJson)
    geojson?: CustomGeoJson;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    keywords?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    resolved?: boolean;
}