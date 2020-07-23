import { ApiProperty, PickType } from '@nestjs/swagger';

import { Conflict } from "src/conflicts/models/conflict";
import { BaseResolution } from './base-resolution';

export class FullResolution extends PickType(BaseResolution, ['resolution_entity', 'resolution_server', 'resolved_by', 'resolved_by_id'] as const) {
    @ApiProperty()
    resolution_id: string;

    @ApiProperty()
    resolution_created_at: Date;

    @ApiProperty()
    resolution_updated_at: Date;

    @ApiProperty()
    resolution_deleted_at?: Date;

    @ApiProperty({ type: () => Conflict })
    conflict: Conflict;
}
