import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Location } from '../../global/models/location';

export class Conflict {
    @ApiProperty()
    id: string;

    @ApiProperty()
    source_server: string;

    @ApiProperty()
    target_server: string;

    @ApiProperty()
    source_entity: object;

    @ApiProperty()
    target_entity: object;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: () => Location })
    location?: Location;

    @ApiProperty()
    has_resolved: boolean;

    @ApiPropertyOptional()
    resolved_at?: Date;

    @ApiPropertyOptional()
    resolution_id?: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiPropertyOptional()
    deleted_at?: Date;
}

