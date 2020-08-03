import {
    GeoJSON
} from "geojson";
import * as geojsonhint from '@mapbox/geojsonhint'
import pluralize = require("pluralize");

export const textToGeojson = (data: string | GeoJSON): GeoJSON => {
    if (data) {
        return JSON.parse(data.toString())
    }
};

export const validateGeojson = (geojson: any, returnErrors = false): { message: string }[] => {
    if (!geojson) {
        return null;
    }
    if (returnErrors) {
        return validateGeojsonWithErrors(geojson)
    }
    return (geojsonhint.hint(geojson)).length === 0 ? [] : null;
}

export const validateGeojsonWithErrors = (geojson: any): { message: string }[] => {
    let errors = geojsonhint.hint(geojson);
    if (errors.length !== 0) {
        errors = errors.map((error: { message: string }) => {
            return error.message;
        });
    }
    return errors;
}

export const convertToSingular = (word: string) => {
    if (pluralize.isSingular) {
        return word
    }
    return pluralize.singular(word);
}

export const isObjectEmpty = (obj: any) => {
    for(const key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
