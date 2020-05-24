import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ResolveDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    selectedServer: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    resolvedBy: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    resolvedById?: string
}