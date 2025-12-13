import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '@common/dto';

import { ProductEntity } from '../entities/product.entity';

export class PaginationProductsDto extends PaginationDto<ProductEntity> {
  /**
   * Total number of records.
   */
  @ApiProperty()
  public readonly count: number;

  /**
   * Result of the selection by the specified parameters.
   */
  @ApiProperty({ type: () => [ProductEntity] })
  public readonly result: ProductEntity[];
}
