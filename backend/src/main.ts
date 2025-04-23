import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { initSwagger } from './swagger';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSwagger(app);

  const envService = app.get(EnvService)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false, //TODO: alterar para true quando todos os contratos possuirem regras de validacao nos campos
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: false,
  }));

  const port = envService.get("PORT")

  await app.listen(port);
}
bootstrap();
