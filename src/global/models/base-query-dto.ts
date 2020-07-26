import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsObject, ValidateNested, IsArray, Min, Max } from 'class-validator';
import { Type } from "class-transformer";

import { MAX_DATE } from '../../global/constants';
import { CustomGeoJson } from 'src/global/models/custom-geojson';
import { BoundingBox } from 'src/global/models/boundingBox';

export class BaseQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(MAX_DATE.getTime())
    @Type(() => Number)
    from?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max((MAX_DATE.getTime()))
    @Type(() => Number)
    to?: number;

    @ApiPropertyOptional({ type: () => CustomGeoJson })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CustomGeoJson)
    geojson?: CustomGeoJson;

    @ApiPropertyOptional({ type: () => BoundingBox })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => BoundingBox)
    bbox?: BoundingBox;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    keywords?: string[];
}