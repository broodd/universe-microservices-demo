import { Injectable } from '@nestjs/common';

import { FindManyOptionsDto, PaginationDto } from 'src/common/dto';

import { ProductsRepository } from './entities/products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async createOne(dto: CreateProductDto): Promise<ProductEntity> {
    return this.repository.createOne(dto);
  }

  async selectManyAndCount(options: FindManyOptionsDto): Promise<PaginationDto<ProductEntity>> {
    return this.repository.selectManyAndCount(options);
  }

  async deleteOneById(id: string): Promise<boolean> {
    return this.repository.deleteOneById(id);
  }
}
