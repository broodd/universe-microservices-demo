import { RMQ_QueueConfigType } from 'src/common/queues/types';

export const PRODUCTS_QUEUE = {
  name: 'products_queue',
  clientToken: 'RMQ_PRODUCTS_SERVICE',
} as const satisfies RMQ_QueueConfigType;
