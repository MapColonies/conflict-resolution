import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Location } from '../../global/models/location';

export class Conflict {
    @ApiProperty()
    id: string;

    @ApiProperty()
    requesting_server: string;

    @ApiProperty()
    requested_server: string;

    @ApiProperty()
    requesting_entity: string;

    @ApiProperty()
    requested_entity: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: () => Location })
    location?: Location;

    @ApiProperty()
    has_resolved: boolean;

    @ApiPropertyOptional()
    resolved_at?: Date;

    @ApiPropertyOptional()
    result_id?: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiPropertyOptional()
    deleted_at?: Date;
}

