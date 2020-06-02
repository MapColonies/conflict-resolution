import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Conflict } from "src/conflicts/models/conflict";

export class FullResolution {
    @ApiProperty()
    resolution_id: string;

    @ApiProperty()
    resolution_server: string;

    @ApiProperty()
    resolution_entity: object;

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