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
    sourceServer: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    targetServer: string;

    @ApiProperty({ type: () => OsmchangeElement })
    @IsObject()
    @ValidateNested()
    @Type(() => OsmchangeElement)
    sourceEntity: OsmchangeElement;

    @ApiProperty({ type: () => OsmchangeElement })
    @IsObject()
    @ValidateNested()
    @Type(() => OsmchangeElement)
    targetEntity: OsmchangeElement;

    @ApiProperty({ enum: OsmChangeType, enumName: 'OsmChangeType' })
    @IsEnum(OsmChangeType)
    sourceChangeType: OsmChangeType;

    @ApiProperty({ enum: OsmChangeType, enumName: 'OsmChangeType' })
    @IsEnum(OsmChangeType)
    targetChangeType: OsmChangeType;
    
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