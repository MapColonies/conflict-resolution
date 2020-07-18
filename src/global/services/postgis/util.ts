import { postgis } from '.';
import { CustomGeoJson } from 'src/global/models/custom-geojson';
import { ExtendedKnexRaw } from '../postgres/knex-types';

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