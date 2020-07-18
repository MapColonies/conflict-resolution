import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CustomGeoJson } from 'src/global/models/custom-geojson';
import { validateGeojson } from '../util';

@Injectable()
export class GeojsonValidationPipe implements PipeTransform {
    constructor(private fieldName?: string) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        let validate = value;
        if (this.fieldName) {
            validate = value?.[this.fieldName];
        }
        if (validate instanceof CustomGeoJson) {
            // errors === [] when valid
            const errors = validateGeojson(validate.parse(), true);
            if (!errors) {
                throw new BadRequestException(`Invalid GeoJSON.`);
            }
            if (errors?.length > 0) {
                throw new BadRequestException(`Invalid GeoJSON. ${errors}`);
            }
        }
        return value;
    }
}
