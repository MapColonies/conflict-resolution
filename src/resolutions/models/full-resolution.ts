import { ApiProperty, PickType } from '@nestjs/swagger';

import { Conflict } from "src/conflicts/models/conflict";
import { BaseResolution } from './base-resolution';

export class FullResolution extends PickType(BaseResolution, ['resolutionEntity', 'resolutionServer', 'resolvedBy', 'resolvedById'] as const) {
    @ApiProperty()
    resolutionId: string;

    @ApiProperty()
    resolutionCreatedAt: Date;

    @ApiProperty()
    resolutionUpdatedAt: Date;

    @ApiProperty()
    resolutionDeletedAt?: Date;

    @ApiProperty({ type: () => Conflict })
    conflict: Conflict;
}
