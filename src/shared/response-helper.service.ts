import { Injectable, HttpStatus } from '@nestjs/common';
import { ApiHttpResponse, ApiHttpError } from '../global/models/common/api-http-response';
import * as HttpStatusCodes from 'http-status-codes';

@Injectable()
export class ResponseHelperService {

    createResponse<T = {}>({ success, data, statusCode, message }: { success: boolean, message?: string, statusCode?: HttpStatus, data?: T }) {
        const res = new ApiHttpResponse<T>(success, data, statusCode);
        if (!success) {
            res.error = this.createError(statusCode, message);
        }
        return res;
    }

    success<T>(data?: T, statusCode = HttpStatus.OK): ApiHttpResponse<T> {
        return this.createResponse<T>({ success: true, data, statusCode })
    }

    error(statusCode: HttpStatus, message?: string): ApiHttpResponse {
        return this.createResponse({ success: false, data: null, statusCode, message });
    }

    // TODO: custom error models should be throwen and handled in a custom exception pipe

    private createError(statusCode = HttpStatus.INTERNAL_SERVER_ERROR, message?: string): ApiHttpError {
        return {
            statusCode,
            message: message || HttpStatusCodes.getStatusText(statusCode)
        }
    }
}
