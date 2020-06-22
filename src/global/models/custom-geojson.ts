import { ApiProperty } from '@nestjs/swagger';
import { GeoJsonObject, Position } from "geojson";

export enum GeoJsonType {
    Point = 'Point',
    MultiPoint = 'MultiPoint',
    LineString = 'LineString',
    MultiLineString = 'MultiLineString',
    Polygon = 'Polygon',
    MultiPolygon = 'MultiPolygon',
    GeometryCollection = 'GeometryCollection'
}

export class CustomGeoJson implements GeoJsonObject {
    @ApiProperty({ enum: GeoJsonType, enumName: 'GeoJsonType' })
    type: GeoJsonType

    @ApiProperty({ type: () => [Number] })
    coordinates: Position[] | Position[][] | Position[][][] | CustomGeoJson[];

    parse() {
        return {
            "type": this.type,
            "coordinates": this.coordinates
        }
    }
}