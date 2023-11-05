import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException, ForbiddenException)
export class NotAuthorizedFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response.status(status).redirect('http://localhost:3001/auth/signin');
    }
}