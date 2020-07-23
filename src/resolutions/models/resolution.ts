import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { BaseResolution } from "./base-resolution";

export class Resolution extends PickType(BaseResolution, ['resolutionEntity', 'resolutionServer', 'resolvedBy', 'resolvedById'] as const) {
    @ApiProperty()
    id: string;

    @ApiProperty()
    conflictId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt?: Date;
}
