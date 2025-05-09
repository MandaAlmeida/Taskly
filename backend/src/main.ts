import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initSwagger } from './swagger';
import { EnvService } from './env/env.service';
import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSwagger(app);

  const envService = app.get(EnvService)
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.useWebSocketAdapter(new IoAdapter(app));

  const port = envService.get("PORT")

  await app.listen(port);
}
bootstrap();
