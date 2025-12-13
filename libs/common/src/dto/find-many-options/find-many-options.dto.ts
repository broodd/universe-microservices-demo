import { IsOptional, Max, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class FindManyOptionsDto {
  /**
   * Offset (paginated) where from entities should be taken
   */
  @Min(1)
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @ApiProperty({
    type: String,
    example: 1,
    description: 'Offset (paginated) where from entities should be taken',
  })
  public page?: number = 1;

  /**
   * Limit (paginated) - max number of entities should be taken
   */
  @Min(1)
  @Max(100)
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @ApiProperty({
    type: String,
    example: 5,
    default: 50,
    description: 'Limit (paginated) - max number of entities should be taken',
  })
  public limit?: number = 50;

  /**
   * Getter to form an object of skip
   */
  @Expose({ toPlainOnly: true })
  public get offset(): number {
    return (this.limit || 0) * (this.page - 1);
  }
}
