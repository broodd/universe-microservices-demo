export class ProductEntity {
  readonly id: string;

  name: string;
  description?: string;
  price: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
}
