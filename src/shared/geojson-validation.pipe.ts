import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import gjv = require('geojson-validation');

import { CustomGeoJson } from 'src/global/models/custom-geojson';

@Injectable()
export class GeojsonValidationPipe implements PipeTransform {
    constructor(private fieldName?: string) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        let validate = value;
        if (this.fieldName) {
            validate = value?.[this.fieldName];
        }
        if (validate instanceof CustomGeoJson) {
            // TODO: test library
            if (!gjv.valid(validate.parse())) {
                throw new BadRequestException('Invalid GeoJSON.');
            }
        }
        return value;
    }
}
