import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { OrderByOptions } from 'src/global/models/order-by-options';

@Injectable()
export class OrderByValidationPipe implements PipeTransform {
    constructor(private tableNames: string[]) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        const { columnName, sortType } = value;
        // meaning no orderBy was asked
        if (!columnName) {
            return null;
        }
        const orderByOptions = new OrderByOptions(columnName, sortType)
        if (!orderByOptions.isValid(this.tableNames)) {
            throw new BadRequestException(`Invalid Order By.`);
        }
        return orderByOptions;
    }
}
