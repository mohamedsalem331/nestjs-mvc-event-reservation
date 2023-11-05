import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException, BadRequestException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response
            .status(status)
            .json({
                statusCode: status,
                message: 'The requested route does not exist',
            });
    }
}