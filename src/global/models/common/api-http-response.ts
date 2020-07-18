import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HttpStatus } from "@nestjs/common";

export class ApiHttpError {
    @ApiProperty()
    statusCode: HttpStatus;

    @ApiProperty()
    message: string;
}

export class ApiHttpResponse<T = {}> {
    constructor(success = true,
        data: T,
        statusCode?: HttpStatus,
        error?: ApiHttpError
    ) {
        this.success = success;
        this.data = data;
        this.statusCode = statusCode;
        this.error = error;
    }

    @ApiProperty()
    success: boolean;

    @ApiProperty()
    data: T | {} = {};

    @ApiPropertyOptional({ type: () => ApiHttpError })
    error: ApiHttpError | {};

    @ApiProperty()
    statusCode: HttpStatus;
}
