import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from "class-transformer";

import { PaginationQueryDto } from './pagination-query-dto';
import { MIN_SEARCH_LENGTH, MAX_SEARCH_LENGTH } from '../constants';

export class TextSearchDto extends PartialType(PaginationQueryDto){
    @ApiPropertyOptional({ type: String })
    @IsString()
    @MinLength(MIN_SEARCH_LENGTH)
    @MaxLength(MAX_SEARCH_LENGTH)
    @Type(() => String)
    text: string;
}