import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';

import { DEFAULT_RMQ_QUEUE_CONFIG } from 'src/common/queues/constants';

import { ConfigService, ConfigModule } from 'src/config';

import { ProductsRepository } from './entities/products.repository';
import { PRODUCTS_QUEUE } from './queues/products-queue.constants';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PRODUCTS_QUEUE.clientToken,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: PRODUCTS_QUEUE.name,
            queueOptions: DEFAULT_RMQ_QUEUE_CONFIG,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
