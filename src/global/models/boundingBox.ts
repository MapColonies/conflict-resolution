import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class BoundingBox {
    @ApiProperty({ type: () => Number })
    @IsNumber()
    @Type(() => Number)
    xMin: number;
    
    @ApiProperty({ type: () => Number })
    @IsNumber()
    @Type(() => Number)
    yMin: number;

    @ApiProperty({ type: () => Number })
    @IsNumber()
    @Type(() => Number)
    xMax: number;

    @ApiProperty({ type: () => Number })
    @IsNumber()
    @Type(() => Number)
    yMax: number;
  }