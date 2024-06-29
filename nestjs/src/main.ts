import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT!;
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalGuards(new RolesGuard(new UserService));
  await app.listen(port);
}
bootstrap();
