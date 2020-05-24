import { postgis } from '.';

const defaultSRID = 4326;

export const setSRID = (geometry, srid: number = defaultSRID) => {
  return postgis.setSRID(geometry, srid);
};

export const createGeometry = (coordinatesArray: number[][], geometryType: string) => {
  return postgis.geomFromGeoJSON(`
    { "type": "${geometryType}",
    "coordinates": ${JSON.stringify([coordinatesArray])}
   }`);
};
