import { IsOptional, IsPositive, MaxLength, IsString, IsInt } from 'class-validator';

export class CreateProductDto {
  @MaxLength(256)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @IsPositive()
  price: number;
}
