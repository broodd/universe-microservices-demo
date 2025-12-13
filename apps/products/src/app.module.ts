import { ThrottlerModule } from '@nestjs/throttler';
import { Module } from '@nestjs/common';

import { ConfigService, ConfigModule } from '@common/config';

import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';

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
    ConfigModule.register({ rootDir: 'apps/products' }),
    DatabaseModule,

    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
