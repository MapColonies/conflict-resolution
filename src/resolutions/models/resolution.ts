import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { BaseResolution } from "./base-resolution";

export class Resolution extends PickType(BaseResolution, ['resolution_entity', 'resolution_server', 'resolved_by', 'resolved_by_id'] as const) {
    @ApiProperty()
    id: string;

    @ApiProperty()
    conflict_id: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    deleted_at?: Date;
}
