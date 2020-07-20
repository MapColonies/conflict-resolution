import { ApiPropertyOptional } from '@nestjs/swagger';
import { ORDER_BY_TABLE_COLUMNS } from '../constants';
import { OrderByTypes, ExposedOrderByTypes, SortByTypes } from './order-by-types';

export class OrderByOptions {
    constructor(columnName: string, sortType: SortByTypes) {
        this.columnName = OrderByTypes[columnName];
        this.sortType = sortType;
    }

    @ApiPropertyOptional({ enum: ExposedOrderByTypes, enumName: 'ExposedOrderByTypes' })
    columnName: ExposedOrderByTypes;

    @ApiPropertyOptional({ enum: SortByTypes, enumName: 'SortByTypes' })
    sortType?: SortByTypes;

    isValid(tableNames: string[]): boolean {
        let arr = [];
        tableNames.forEach(tableName => {
            if (ORDER_BY_TABLE_COLUMNS[tableName]) {
                arr.push(...ORDER_BY_TABLE_COLUMNS[tableName])
            }
        })
        if (!arr.includes(this.columnName)) {
            return false;
        }
        if (this.sortType === undefined) {
            this.sortType = SortByTypes.ASC;
        }
        return true;
    }
}