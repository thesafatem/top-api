import { Type } from 'class-transformer';
import { IsNumber, IsString, Min, ValidateNested } from 'class-validator';

export class ProductCharacteristicDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @Min(0)
  @IsNumber()
  price: number;

  @Min(0)
  @IsNumber()
  oldPrice?: number;

  @IsNumber()
  credit: number;

  @IsString()
  description: string;

  @IsString()
  advantages: string;

  @IsString()
  disadvantages: string;

  @IsString({ each: true })
  categories: string[];

  @IsString({ each: true })
  tags: string[];

  @ValidateNested({ each: true })
  @Type(() => ProductCharacteristicDto)
  characteristics: ProductCharacteristicDto[];
}
