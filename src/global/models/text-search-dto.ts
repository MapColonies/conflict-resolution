import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from "class-transformer";

import { PaginationQueryDto } from './pagination-query-dto';
import { minSearchLength, maxSearchLength } from '../constants';

export class TextSearchDto extends PartialType(PaginationQueryDto){
    @ApiPropertyOptional({ type: String })
    @IsString()
    @MinLength(minSearchLength)
    @MaxLength(maxSearchLength)
    @Type(() => String)
    text: string;
}