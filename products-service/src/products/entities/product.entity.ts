export class ProductEntity {
  readonly id: string;

  name: string;
  description?: string;
  price: number;

  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at?: Date;
}
