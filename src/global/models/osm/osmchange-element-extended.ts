import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeoJSON } from "geojson";

import { OsmchangeElement } from './osmchange-element'
import { CustomGeoJson } from '../custom-geojson';

export class OsmchangeElementExtended {
    @ApiProperty({ type: () => OsmchangeElement })
    element: OsmchangeElement;

    @ApiPropertyOptional({ type: () => CustomGeoJson })
    geojson?: GeoJSON;
    
    @ApiPropertyOptional({ type: () => [OsmchangeElement] })
    fullElements?: OsmchangeElement[];
}

