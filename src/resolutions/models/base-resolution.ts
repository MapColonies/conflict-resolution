import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BaseResolution {

    @ApiProperty()
    resolution_server: string;

    @ApiProperty()
    resolution_entity: object;

    @ApiPropertyOptional()
    resolved_by?: string;

    @ApiPropertyOptional()
    resolved_by_id?: string;;
}