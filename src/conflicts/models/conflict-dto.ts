import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsObject, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from "class-transformer";

import { Location } from '../../global/models/location';

export class ConflictDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    source_server: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    target_server: string;

    @ApiProperty()
    @IsObject()
    @IsNotEmpty()
    @Type(() => Object)
    source_entity: object;

    @ApiProperty()
    @IsObject()
    @IsNotEmpty()
    @Type(() => Object)
    target_entity: object;

    @ApiPropertyOptional()
    @IsString()
    @Type(() => String)
    description?: string;

    @ApiProperty({ type: () => Location })
    @IsObject()
    @ValidateNested()
    @Type(() => Location)
    location: Location;

    // import { Raw, QueryBuilder } from "knex";

    // location: string |
    // Raw<any> |
    // QueryBuilder<any, any> |
    // GeoJSON.Point |
    // GeoJSON.MultiPoint |
    // GeoJSON.LineString |
    // GeoJSON.MultiLineString |
    // GeoJSON.Polygon |
    // GeoJSON.MultiPolygon |
    // GeoJSON.GeometryCollection;
}