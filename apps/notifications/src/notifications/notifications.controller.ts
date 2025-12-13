import { EventPattern, Payload } from '@nestjs/microservices';
import { Controller, Logger } from '@nestjs/common';

import { ProductCreatedEventPayload } from '@common/products/queues/events/create-product.event';
import { ProductDeletedEventPayload } from '@common/products/queues/events/delete-product.event';
import { ProductEventsEnum } from '@common/products/queues/events/product-events.enum';
import { BaseEvent } from '@common/queues/types/base-event.interface';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  @EventPattern(ProductEventsEnum.CREATED)
  handleProductCreated(@Payload() data: BaseEvent<ProductCreatedEventPayload>) {
    this.logger.log(`[RECEIVED] Type: ${data.type}`, data);
  }

  @EventPattern(ProductEventsEnum.DELETED)
  handleProductDeleted(@Payload() data: BaseEvent<ProductDeletedEventPayload>) {
    this.logger.log(`[RECEIVED] Type: ${data.type}`, data);
  }
}
