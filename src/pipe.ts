import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    let parsed: any;
    try {
      parsed = JSON.parse(value.config);
    } catch (err) {
      throw new BadRequestException('Invalid JSON for config.');
    }

    const { error } = this.schema.validate(parsed, { abortEarly: false });
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
