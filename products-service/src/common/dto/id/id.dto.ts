import { IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ID {
  /**
   * Entity ID
   */
  @IsUUID()
  @ApiProperty()
  public readonly id: string;
}
