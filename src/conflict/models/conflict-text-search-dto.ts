import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Type } from "class-transformer";

import { PaginationQueryDto } from '../../global/models/pagination-query-dto';

export class ConflictTextSearchDto extends PartialType(PaginationQueryDto){
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @Type(() => String)
    text?: string;
}