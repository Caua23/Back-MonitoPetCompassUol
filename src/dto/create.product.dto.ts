import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  addInformation: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  product: 'food' | 'toy' | 'costume';

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  size: number;
}
