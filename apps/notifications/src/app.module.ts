import { Module } from '@nestjs/common';

import { ConfigModule } from '@common/config';

import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [ConfigModule.register({ rootDir: 'apps/notifications' }), NotificationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
