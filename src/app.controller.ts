import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { configSchema } from './schema';
import { createJoiValidationPipe } from './pipe';
import { ValidationExceptionFilter } from './exceptionFilters';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { CrawlLaunchBody } from './swagger';

@UseFilters(ValidationExceptionFilter)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('start-crawl')
  @ApiOperation({ summary: 'Start a crawl' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(CrawlLaunchBody.ApiSchema)
  @ApiBadRequestResponse({
    description: 'Validation error response',
    schema: {
      example: {
        type: 'https://example.net/validation-error',
        title: "Your request parameters didn't validate.",
        'invalid-params': [
          {
            key: 'startDate',
            message: '"startDate" is required',
          },
          {
            key: 'age',
            message: '"age" is required',
          },
        ],
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(createJoiValidationPipe(configSchema))
  public async startCrawl(
    @UploadedFile() file: Express.Multer.File,
    @Body() config: any,
  ) {
    // `config` is now the validated JSON object
    // Proceed with business logic
    return {
      message: 'Crawl started successfully',
      config,
    };
  }
}
