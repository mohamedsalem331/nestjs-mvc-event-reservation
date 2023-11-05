import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path } = request;
    const userAgent = request.get('user-agent') || '';
    const hostOrigin = request.get('host');
    const url = request.originalUrl;

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.debug(
        `${method} ${path} ${url} host: ${hostOrigin} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
