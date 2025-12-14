import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';

import { PRODUCTS_QUEUE } from '@common/products/queues/products-queue.constants';
import { DEFAULT_RMQ_QUEUE_CONFIG } from '@common/queues/constants';
import { ConfigService, ConfigModule } from '@common/config';

import { PRODUCT_METRICS } from './metrics/product-metrics.constants';
import { ProductsRepository } from './entities/products.repository';
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
  providers: [
    ProductsService,
    ProductsRepository,

    makeCounterProvider({
      name: PRODUCT_METRICS.ACTIONS_TOTAL,
      help: 'Product actions tracking',
      labelNames: ['action', 'status'],
    }),
  ],
})
export class ProductsModule {}
