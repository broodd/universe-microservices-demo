import { Controller, Delete, Param, Query, Body, Post, Get } from '@nestjs/common';

import { FindManyOptionsDto, ID } from '@common/dto';

import { PaginationProductsDto, CreateProductDto } from './dto';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(public readonly service: ProductsService) {}

  @Post()
  public async createOne(@Body() data: CreateProductDto): Promise<ProductEntity> {
    return this.service.createOne(data);
  }

  @Get()
  public async selectManyAndCount(
    @Query() options: FindManyOptionsDto,
  ): Promise<PaginationProductsDto> {
    return this.service.selectManyAndCount(options);
  }

  @Delete(':id')
  public async deleteOneById(@Param() conditions: ID): Promise<void> {
    await this.service.deleteOneById(conditions);
  }
}
