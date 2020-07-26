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

export type bbox = {
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number
}

export const createBoundingBox = (bbox: bbox, srid = DEFAULT_SRID): ExtendedKnexRaw => {
  return postgis.makeEnvelope(bbox.xMin, bbox.yMin, bbox.xMax, bbox.yMax, srid);
}