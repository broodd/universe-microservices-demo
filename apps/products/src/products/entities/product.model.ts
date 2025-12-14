import { timestamp, integer, pgTable, varchar, text, uuid } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),

  name: varchar('name', { length: 256 }).notNull(),
  description: text('description'),
  price: integer('price').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
