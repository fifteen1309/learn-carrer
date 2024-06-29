import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Optional,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  ErrorHttpStatusCode,
  HttpErrorByCode,
} from '@nestjs/common/utils/http-error-by-code.util';

export interface ValidationPipeOption {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: any) => any;
  optional?: boolean;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  protected exceptionFactory: (error: any) => any;

  constructor(@Optional() protected readonly options?: ValidationPipeOption) {
    options = options || {};
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } =
      options;

    this.exceptionFactory =
      exceptionFactory ||
      ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);

    const errors = await validate(object);
    if (errors.length > 0) {
      throw this.exceptionFactory(
        errors.map((err) => Object.values(err.constraints!)),
      );
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
