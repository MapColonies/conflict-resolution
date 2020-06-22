import * as Knex from 'knex';

import { postgis } from '.';
import { CustomGeoJson } from 'src/global/models/custom-geojson';

export interface ExtendedKnexRaw extends Knex.Raw {
  as(alias: string): ExtendedKnexRaw
}

export const DEFAULT_SRID = 4326;

export const createGeometry = (coordinatesArray: number[][], geometryType: string): ExtendedKnexRaw =>
  postgis.geomFromGeoJSON(`
    { "type": "${geometryType}",
    "coordinates": ${JSON.stringify([coordinatesArray])}
   }`);

export const createGeometryFromGeojson = (geojson: CustomGeoJson): ExtendedKnexRaw => {
  return postgis.geomFromGeoJSON(`
    { "type": "${geojson.type}",
    "coordinates": ${JSON.stringify(geojson.coordinates)}
   }`);
}