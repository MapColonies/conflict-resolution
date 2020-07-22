import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { OrderByOptions } from 'src/global/models/order-by-options';

@Injectable()
export class OrderByValidationPipe implements PipeTransform {
    constructor(private tableNames: string[]) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        const { columnName, sortType, ...rest } = value;
        // meaning no orderBy was asked
        if (!columnName) {
            return isEmpty(rest) ? null : rest;
        }
        const validOrderByOptions = new OrderByOptions(columnName, sortType)
        if (!validOrderByOptions.isValid(this.tableNames)) {
            throw new BadRequestException(`Invalid Order By.`);
        }
        return isEmpty(rest) ? validOrderByOptions : { ...rest, validOrderByOptions };
    }
}

const isEmpty = (obj: any) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
