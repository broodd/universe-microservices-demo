import { ThrottlerModule } from '@nestjs/throttler';
import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';
import { ConfigService, ConfigModule } from './config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get('THROTTLE_TTL'),
            limit: configService.get('THROTTLE_LIMIT'),
          },
        ],
      }),
    }),
    ConfigModule,
    DatabaseModule,

    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
