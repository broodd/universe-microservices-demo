import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { FindManyOptionsDto, PaginationDto, ID } from 'src/common/dto';
import { createEvent } from 'src/common/queues/events/event-factory';

import { ProductCreatedEventPayload } from './queues/events/create-product.event';
import { ProductDeletedEventPayload } from './queues/events/delete-product.event';
import { ProductEventsEnum } from './queues/events/product-events.enum';
import { ProductsRepository } from './entities/products.repository';
import { PRODUCTS_QUEUE } from './queues/products-queue.constants';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly repository: ProductsRepository,
    @Inject(PRODUCTS_QUEUE.clientToken) private readonly client: ClientProxy,
  ) {}

  async createOne(dto: CreateProductDto): Promise<ProductEntity> {
    const entity = await this.repository.createOne(dto);

    const event = createEvent<ProductCreatedEventPayload>(ProductEventsEnum.CREATED, entity);
    this.client.emit(event.type, event);

    return entity;
  }

  async selectManyAndCount(options: FindManyOptionsDto): Promise<PaginationDto<ProductEntity>> {
    return this.repository.selectManyAndCount(options);
  }

  async deleteOneById(conditions: ID): Promise<boolean> {
    const result = await this.repository.deleteOneById(conditions.id);

    if (result) {
      const event = createEvent<ProductDeletedEventPayload>(ProductEventsEnum.DELETED, conditions);
      this.client.emit(event.type, event);
    }

    return result;
  }
}
