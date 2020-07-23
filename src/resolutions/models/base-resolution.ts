import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BaseResolution {

    @ApiProperty()
    resolutionServer: string;

    @ApiProperty()
    resolutionEntity: object;

    @ApiPropertyOptional()
    resolvedBy?: string;

    @ApiPropertyOptional()
    resolvedById?: string;;
}
