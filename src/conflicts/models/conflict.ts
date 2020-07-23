import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeoJSON } from "geojson";

import { OsmchangeElement } from 'src/global/models/osm/osmchange-element';
import { CustomGeoJson } from 'src/global/models/custom-geojson';
import { OsmChangeType } from '../../global/models/osm/osm-change-type';

export class Conflict {
    @ApiProperty()
    id: string;

    @ApiProperty()
    sourceServer: string;

    @ApiProperty()
    targetServer: string;

    @ApiProperty({ type: () => OsmchangeElement })
    sourceEntity: OsmchangeElement;

    @ApiProperty({ type: () => OsmchangeElement })
    targetEntity: OsmchangeElement;

    @ApiProperty({ enum: OsmChangeType, enumName: 'OsmChangeType' })
    sourceChangeType: OsmChangeType;

    @ApiProperty({ enum: OsmChangeType, enumName: 'OsmChangeType' })
    targetChangeType: OsmChangeType;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: () => CustomGeoJson })
    location?: GeoJSON | string;

    @ApiProperty()
    hasResolved: boolean;

    @ApiPropertyOptional()
    resolvedAt?: Date;

    @ApiPropertyOptional()
    resolutionId?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiPropertyOptional()
    deletedAt?: Date;
}
