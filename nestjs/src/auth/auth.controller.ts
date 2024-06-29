import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
