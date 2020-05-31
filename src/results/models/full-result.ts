import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Conflict } from "src/conflicts/models/conflict";

export class FullResult {
    @ApiProperty()
    result_id: string;

    @ApiProperty()
    result_server: string;

    @ApiProperty()
    result_entity: object;

    @ApiPropertyOptional()
    resolved_by?: string;

    @ApiPropertyOptional()
    resolved_by_id?: string;

    @ApiProperty()
    r_created_at: Date;

    @ApiProperty()
    r_updated_at: Date;

    @ApiProperty({ type: () => Conflict })
    conflict: Conflict;
}