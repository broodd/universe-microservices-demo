import { defineConfig } from 'drizzle-kit';

import { ConfigService } from 'src/config';

const configService = new ConfigService();

export default defineConfig({
  schema: 'src/**/*.model.ts',
  out: './src/database/migrations',
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
