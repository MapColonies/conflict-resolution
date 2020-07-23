import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { OrderByOptions } from 'src/global/models/order-by-options';
import { isObjectEmpty } from 'src/util';

@Injectable()
export class OrderByValidationPipe implements PipeTransform {
    constructor(private tableNames: string[]) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        const { columnName, sortType, ...rest } = value;
        // meaning no orderBy was asked
        if (!columnName) {
            return isObjectEmpty(rest) ? null : rest;
        }
        const validOrderByOptions = new OrderByOptions(columnName, sortType)
        if (!validOrderByOptions.isValid(this.tableNames)) {
            throw new BadRequestException(`Invalid Order By.`);
        }
        return { ...rest, validOrderByOptions };
    }
}
