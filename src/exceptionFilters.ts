import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const exceptionResponse: any = exception.getResponse();
    let invalidParams = [];
    if (typeof exceptionResponse === 'object' && exceptionResponse.errors) {
      invalidParams = exceptionResponse.errors;
    } else {
      invalidParams.push({
        key: 'config',
        message: exceptionResponse.message || 'Validation error',
      });
    }
    response.status(400).json({
      type: 'https://example.net/validation-error',
      title: "Your request parameters didn't validate.",
      'invalid-params': invalidParams,
    });
  }
}
