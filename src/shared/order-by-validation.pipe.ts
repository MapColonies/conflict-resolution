import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { OrderByOptions } from 'src/global/models/order-by-options';

@Injectable()
export class OrderByValidationPipe implements PipeTransform {
    constructor(private tableName: string) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        const { columnName, isAscending } = value;
        // meaning no orderBy was asked
        if (!columnName) {
            return null;
        }
        const orderByOptions = new OrderByOptions(columnName, isAscending, this.tableName)
        if (!orderByOptions.isValid()) {
            throw new BadRequestException(`Invalid Order By.`);
        }
        return orderByOptions;
    }
}
