import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Type,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectSchema } from 'joi';

export function createJoiValidationPipe(
  schema: ObjectSchema,
): Type<PipeTransform> {
  @Injectable()
  class JoiValidationPipe implements PipeTransform {
    constructor(@Inject(REQUEST) private readonly request: any) {}

    transform(value: any, metadata: ArgumentMetadata) {
      if (!this.request.file) {
        throw new BadRequestException('File is required.');
      }

      let parsed: any;
      try {
        parsed = JSON.parse(value.config);
      } catch (err) {
        throw new BadRequestException('Invalid JSON for config.');
      }

      const { error } = schema.validate(parsed, { abortEarly: false });
      if (error) {
        const validationErrors = error.details.map((detail) => ({
          key: detail.context?.key,
          message: detail.message,
        }));
        throw new BadRequestException({
          errors: validationErrors,
        });
      }

      return parsed;
    }
  }
  return JoiValidationPipe;
}
