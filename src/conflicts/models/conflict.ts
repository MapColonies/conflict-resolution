import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeoJSON } from "geojson";

import { OsmchangeElement } from 'src/global/models/osm/osmchange-element';
import { CustomGeoJson } from 'src/global/models/custom-geojson';
import { OsmChangeType } from '../../global/models/osm/osm-change-type';

export class Conflict {
    @ApiProperty()
    id: string;

    @ApiProperty()
    source_server: string;

    @ApiProperty()
    target_server: string;

    @ApiProperty({ type: () => OsmchangeElement })
    source_entity: OsmchangeElement;

    @ApiProperty({ type: () => OsmchangeElement })
    target_entity: OsmchangeElement;

    @ApiProperty({ enum: OsmChangeType, enumName: 'OsmChangeType' })
    source_change_type: OsmChangeType;

    @ApiProperty({ enum: OsmChangeType, enumName: 'OsmChangeType' })
    target_change_type: OsmChangeType;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: () => CustomGeoJson })
    location?: GeoJSON | string;

    @ApiProperty()
    has_resolved: boolean;

    @ApiPropertyOptional()
    resolved_at?: Date;

    @ApiPropertyOptional()
    resolution_id?: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiPropertyOptional()
    deleted_at?: Date;
}
