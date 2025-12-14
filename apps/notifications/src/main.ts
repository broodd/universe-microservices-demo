import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { PRODUCTS_QUEUE } from '@common/products/queues/products-queue.constants';
import { DEFAULT_RMQ_QUEUE_CONFIG } from '@common/queues/constants';
import { ConfigService } from '@common/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const configService = new ConfigService({ rootDir: 'apps/notifications' });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: PRODUCTS_QUEUE.name,
      queueOptions: DEFAULT_RMQ_QUEUE_CONFIG,
      noAck: true,
    },
  });

  await app.listen();
}
void bootstrap();
