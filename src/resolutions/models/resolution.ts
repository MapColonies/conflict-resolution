import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseResolution } from "./base-resolution";

export class Resolution extends PartialType(BaseResolution) {
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
