import { getToken } from '@willsoto/nestjs-prometheus';
import request from 'supertest';
import { of } from 'rxjs';

import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { TestingModule, Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { PRODUCTS_QUEUE } from '@common/products/queues/products-queue.constants';

import { validationPipe } from '../common/pipes';

import {
  ProductMetricAction,
  ProductMetricStatus,
  PRODUCT_METRICS,
} from './metrics/product-metrics.constants';
import { ProductsRepository } from './entities/products.repository';
import { ProductsModule } from './products.module';

describe('Products (Integration)', () => {
  let app: INestApplication;

  const mockRepository = {
    createOne: jest.fn(),
    selectManyAndCount: jest.fn(),
    deleteOneById: jest.fn(),
  };

  const mockRabbitClient = {
    emit: jest.fn(() => of({})),
  };

  const mockCounter = {
    labels: jest.fn().mockReturnThis(),
    inc: jest.fn(),
  };

  const mockID = 'a2a2f8cc-802e-4964-8b51-6048b7d2b7fa';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    })
      .overrideProvider(ProductsRepository)
      .useValue(mockRepository)

      .overrideProvider(PRODUCTS_QUEUE.clientToken)
      .useValue(mockRabbitClient)

      .overrideProvider(getToken(PRODUCT_METRICS.ACTIONS_TOTAL))
      .useValue(mockCounter)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter(), {
      logger: false,
    });
    app.useGlobalPipes(validationPipe);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /products', () => {
    it('should create a product and return 201', async () => {
      const dto = { name: 'Test Product', price: 100 };
      const createdEntity = {
        id: mockID,
        ...dto,
        createdAt: new Date(),
      };

      mockRepository.createOne.mockResolvedValue(createdEntity);

      const response = await request(app.getHttpServer()).post('/products').send(dto).expect(201);

      expect(response.body).toEqual({
        id: createdEntity.id,
        name: 'Test Product',
        price: 100,
        createdAt: expect.any(String),
      });

      expect(mockCounter.labels).toHaveBeenCalledWith(
        ProductMetricAction.CREATE,
        ProductMetricStatus.SUCCESS,
      );
      expect(mockCounter.inc).toHaveBeenCalled();

      expect(mockRabbitClient.emit).toHaveBeenCalled();
    });

    it('should increment metric error if repository fails', async () => {
      mockRepository.createOne.mockRejectedValue(new Error('DB Error'));

      await request(app.getHttpServer())
        .post('/products')
        .send({ name: 'Fail Product', price: 100 })
        .expect(500);

      expect(mockCounter.labels).toHaveBeenCalledWith(
        ProductMetricAction.CREATE,
        ProductMetricStatus.ERROR,
      );
    });

    it('should return 400 Bad Request if input data is invalid', async () => {
      const invalidDto = { name: '', price: 'not-a-number' };

      await request(app.getHttpServer()).post('/products').send(invalidDto).expect(400);

      expect(mockRepository.createOne).not.toHaveBeenCalled();
      expect(mockRabbitClient.emit).not.toHaveBeenCalled();
      expect(mockCounter.inc).not.toHaveBeenCalled();
    });
  });

  describe('GET /products', () => {
    it('should return paginated list', async () => {
      const mockResult = {
        result: [{ id: mockID, name: 'Test product', description: null, price: 100 }],
        count: 1,
      };
      mockRepository.selectManyAndCount.mockResolvedValue(mockResult);

      const response = await request(app.getHttpServer())
        .get('/products?page=1&limit=10')
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(mockRepository.selectManyAndCount).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete product and return 200', async () => {
      mockRepository.deleteOneById.mockResolvedValue(true);

      await request(app.getHttpServer())
        .delete('/products/' + mockID)
        .expect(200);

      expect(mockRabbitClient.emit).toHaveBeenCalled();
      expect(mockCounter.labels).toHaveBeenCalledWith(
        ProductMetricAction.DELETE,
        ProductMetricStatus.SUCCESS,
      );
    });

    it('should return false if product not found', async () => {
      mockRepository.deleteOneById.mockResolvedValue(false);

      await request(app.getHttpServer())
        .delete('/products/' + mockID)
        .expect(404);

      expect(mockCounter.labels).toHaveBeenCalledWith(
        ProductMetricAction.DELETE,
        ProductMetricStatus.ERROR,
      );

      expect(mockRabbitClient.emit).not.toHaveBeenCalled();
    });
  });
});
