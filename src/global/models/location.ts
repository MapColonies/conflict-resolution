import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsArray, ArrayNotEmpty } from 'class-validator';
import { Type } from "class-transformer";

export enum LocationType {
    Point = 'Point',
    Polygon = 'Polygon'
}

export class Location {
    @ApiProperty({ enum: LocationType, enumName: 'LocationType' })
    @IsEnum(LocationType)
    type: LocationType;

    @ApiProperty({ type: [Number] })
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    coordinates: number[]
}