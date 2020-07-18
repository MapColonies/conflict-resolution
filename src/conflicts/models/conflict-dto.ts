import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsObject, IsNotEmpty, ValidateNested, IsEnum } from 'class-validator';
import { Type } from "class-transformer";

import { CustomGeoJson } from '../../global/models/custom-geojson'
import { OsmchangeElement } from 'src/global/models/osm/osmchange-element';
import { OsmChangeType } from 'src/global/models/osm/osm-change-type';

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

    @ApiProperty({ type: () => OsmchangeElement })
    @IsObject()
    @ValidateNested()
    @Type(() => OsmchangeElement)
    source_entity: OsmchangeElement;

    @ApiProperty({ type: () => OsmchangeElement })
    @IsObject()
    @ValidateNested()
    @Type(() => OsmchangeElement)
    target_entity: OsmchangeElement;

    @ApiProperty({ enum: OsmChangeType, enumName: 'OsmChangeType' })
    @IsEnum(OsmChangeType)
    source_change_type: OsmChangeType;

    @ApiProperty({ enum: OsmChangeType, enumName: 'OsmChangeType' })
    @IsEnum(OsmChangeType)
    target_change_type: OsmChangeType;
    
    @ApiPropertyOptional()
    @IsString()
    @Type(() => String)
    description?: string;

    @ApiProperty({ type: () => CustomGeoJson })
    @IsObject()
    @ValidateNested()
    @Type(() => CustomGeoJson)
    location: CustomGeoJson;
}