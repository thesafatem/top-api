import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum TopCategory {
  Courses,
  Services,
  Books,
  Goods,
}

export class HhData {
  @IsNumber()
  count: number;

  @Min(0)
  @IsNumber()
  juniorSalary: number;

  @Min(0)
  @IsNumber()
  middleSalary: number;

  @Min(0)
  @IsNumber()
  seniorSalary: number;
}

export class TopPageAdvantage {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateTopPageDto {
  @IsEnum(TopCategory)
  firstCategory: TopCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @Type(() => HhData)
  @ValidateNested()
  hh?: HhData;

  @ValidateNested({ each: true })
  @Type(() => TopPageAdvantage)
  advantages: TopPageAdvantage[];

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsString({ each: true })
  tags: string[];
}
