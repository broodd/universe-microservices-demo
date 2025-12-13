import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter } from './common/filters';
import { validationPipe } from './common/pipes';

import { ConfigMode } from './config/enums/config.enum';
import { ConfigService } from './config';
import { AppModule } from './app.module';
import { swaggerSetup } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('PREFIX')).enableCors({
    credentials: configService.get('CORS_CREDENTIALS'),
    origin: configService.get('CORS_ORIGIN'),
  });

  if (configService.getMode(ConfigMode.production)) app.enableShutdownHooks();

  await swaggerSetup(app, configService);

  app.useGlobalPipes(validationPipe).useGlobalFilters(new HttpExceptionFilter());
  await app.listen(configService.get('PORT'), configService.get('HOST'));
}

void bootstrap();
