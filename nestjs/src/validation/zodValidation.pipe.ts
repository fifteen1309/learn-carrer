import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';
import {
  ErrorHttpStatusCode,
  HttpErrorByCode,
} from '@nestjs/common/utils/http-error-by-code.util';
import { ZodError, ZodSchema } from 'zod';

export interface ZodValidationPipeOption {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
  optional?: boolean;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  protected exceptionFactory: (error: string) => any;

  constructor(
    private schema: ZodSchema,
    @Optional() protected readonly options?: ZodValidationPipeOption,
  ) {
    options = options || {};
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } =
      options;

    this.exceptionFactory =
      exceptionFactory ||
      ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw this.exceptionFactory(JSON.parse(error.message));
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
