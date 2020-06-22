import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ElementType } from "./osm-element-type";

export class Member {
    @ApiProperty({ enum: ElementType, enumName: 'ElementType' })
    type: ElementType;

    @ApiProperty()
    ref: string;

    @ApiProperty()
    role: string;
}

export class OsmchangeElement {
    @ApiProperty({ enum: ElementType, enumName: 'ElementType' })
    type: ElementType;

    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    lat?: number;

    @ApiPropertyOptional()
    lon?: number;

    @ApiProperty()
    timestamp: Date;

    @ApiProperty()
    version: number;

    @ApiProperty()
    changeset: number;

    @ApiProperty()
    user: string;

    @ApiProperty()
    uid: string;

    @ApiProperty()
    tags: any;

    @ApiPropertyOptional()
    nodes?: string[];

    @ApiPropertyOptional({ type: () => [Member] })
    members?: Member[];
}