import { ApiBodyOptions } from '@nestjs/swagger';
import { configSchema } from './schema';

const openApiSchema: ApiBodyOptions = {
  description: 'Properties of the crawl to launch',
  schema: {
    type: 'object',
    properties: {
      config: {
        type: 'string',
        description: 'JSON string with crawl configuration',
      },
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export class CrawlLaunchBody {
  static ApiSchema = openApiSchema;

  config: {
    startDate: string;
    age: number;
    name: string;
  };

  static validate(data: CrawlLaunchBody) {
    return configSchema.validate(data, { abortEarly: false });
  }
}
