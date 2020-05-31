import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from "class-transformer";

import { PaginationQueryDto } from './pagination-query-dto';

export class TextSearchDto extends PartialType(PaginationQueryDto){
    @ApiPropertyOptional({ type: String })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @Type(() => String)
    text: string;
}