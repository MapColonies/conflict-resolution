import {
    GeoJSON
} from "geojson";

export const textToGeojson = (data: string | GeoJSON ): GeoJSON => {
    if (data) {
        return JSON.parse(data.toString())
    }
};
