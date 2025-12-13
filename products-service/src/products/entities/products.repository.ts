import postgres from 'postgres';

import { Injectable, Inject } from '@nestjs/common';

import { FindManyOptionsDto, PaginationDto } from 'src/common/dto';

import { DATABASE_CONNECTION } from 'src/database/database.module';

import { CreateProductDto } from '../dto';

import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly sql: postgres.Sql) {}

  async createOne(dto: CreateProductDto): Promise<ProductEntity> {
    const result = await this.sql<ProductEntity[]>`
			INSERT INTO products (name, description, price)
			VALUES (${dto.name}, ${dto.description}, ${dto.price})
			RETURNING *
		`;
    return result[0];
  }

  async selectMany(options: FindManyOptionsDto): Promise<ProductEntity[]> {
    return await this.sql<ProductEntity[]>`
      SELECT id, name, description, price, created_at, updated_at, deleted_at
      FROM products
      ORDER BY created_at DESC
      LIMIT ${options.limit} OFFSET ${options.offset}
    `;
  }

  async selectManyAndCount(options: FindManyOptionsDto): Promise<PaginationDto<ProductEntity>> {
    const data = await Promise.all([this.selectMany(options), this.countTotal()]);
    return new PaginationDto<ProductEntity>(data);
  }

  async countTotal(): Promise<number> {
    const result = await this.sql<[{ count: string }]>`
      SELECT COUNT(*) FROM products
    `;
    return parseInt(result[0].count, 10);
  }

  async deleteOneById(id: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM products 
      WHERE id = ${id}
    `;
    return result.count > 0;
  }
}
