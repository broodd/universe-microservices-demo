import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import { NotFoundException, Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ProductCreatedEventPayload } from '@common/products/queues/events/create-product.event';
import { ProductDeletedEventPayload } from '@common/products/queues/events/delete-product.event';
import { ProductEventsEnum } from '@common/products/queues/events/product-events.enum';
import { PRODUCTS_QUEUE } from '@common/products/queues/products-queue.constants';
import { FindManyOptionsDto, PaginationDto, ID } from '@common/dto';
import { createEvent } from '@common/queues/events/event-factory';

import {
  ProductMetricAction,
  ProductMetricStatus,
  PRODUCT_METRICS,
} from './metrics/product-metrics.constants';
import { ProductsRepository } from './entities/products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly repository: ProductsRepository,
    @Inject(PRODUCTS_QUEUE.clientToken) private readonly client: ClientProxy,
    @InjectMetric(PRODUCT_METRICS.ACTIONS_TOTAL) public counterActions: Counter,
  ) {}

  private incrementMetric(action: ProductMetricAction, status: ProductMetricStatus): void {
    this.counterActions.labels(action, status).inc();
  }

  async createOne(dto: CreateProductDto): Promise<ProductEntity> {
    try {
      const entity = await this.repository.createOne(dto);

      this.incrementMetric(ProductMetricAction.CREATE, ProductMetricStatus.SUCCESS);

      const event = createEvent<ProductCreatedEventPayload>(ProductEventsEnum.CREATED, entity);
      this.client.emit(event.type, event);

      return entity;
    } catch (error) {
      this.incrementMetric(ProductMetricAction.CREATE, ProductMetricStatus.ERROR);
      throw error;
    }
  }

  async selectManyAndCount(options: FindManyOptionsDto): Promise<PaginationDto<ProductEntity>> {
    return this.repository.selectManyAndCount(options);
  }

  async deleteOneById(conditions: ID): Promise<void> {
    try {
      const result: boolean = await this.repository.deleteOneById(conditions.id);
      if (!result) throw new NotFoundException();

      this.incrementMetric(ProductMetricAction.DELETE, ProductMetricStatus.SUCCESS);

      const event = createEvent<ProductDeletedEventPayload>(ProductEventsEnum.DELETED, conditions);
      this.client.emit(event.type, event);
    } catch (error) {
      this.incrementMetric(ProductMetricAction.DELETE, ProductMetricStatus.ERROR);
      throw error;
    }
  }
}
