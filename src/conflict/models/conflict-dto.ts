import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsObject, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from "class-transformer";

import { Location } from '../../global/models/location';

export class ConflictDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    requesting_server: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    requested_server: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    requesting_entity: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    requested_entity: string;

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