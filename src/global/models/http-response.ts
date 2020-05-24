import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HttpResponse {
    constructor(message: string, statusCode = 200, entity?: any) {
        this.message = message,
        this.statusCode = statusCode,
        this.entity = entity;
    }

    @ApiProperty()
    message: string;

    @ApiProperty()
    statusCode: number;

    @ApiPropertyOptional()
    entity?: any;
}