import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

import { BaseQueryDto } from 'src/global/models/base-query-dto';

export class ResolutionQueryDto extends PickType(BaseQueryDto, ['from', 'to', 'geojson', 'bbox', 'keywords'] as const) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    includeConflict?: boolean;
}
