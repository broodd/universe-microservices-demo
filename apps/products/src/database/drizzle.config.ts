import { defineConfig } from 'drizzle-kit';

import { ConfigService } from '@common/config';

const configService = new ConfigService({ rootDir: 'apps/products' });

export default defineConfig({
  schema: 'src/**/*.model.ts',
  out: './apps/products/src/database/migrations',
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  migrations: {
    table: '__drizzle_migrations',
    schema: 'public',
  },
  dbCredentials: {
    user: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    database: configService.get<string>('DATABASE_NAME'),
  },
});
