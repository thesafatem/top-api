import { Type } from 'class-transformer';
import {
	IsString,
	IsNumber,
	Min,
	ValidateNested,
	IsEnum,
	IsOptional,
	IsDate,
} from 'class-validator';

export enum TopCategory {
	Courses,
	Services,
	Books,
	Goods,
}

export class HhDataDto {
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

	@IsDate()
	updatedAt: Date;
}

export class TopPageAdvantageDto {
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
	@Type(() => HhDataDto)
	@ValidateNested()
	hh?: HhDataDto;

	@ValidateNested({ each: true })
	@Type(() => TopPageAdvantageDto)
	advantages: TopPageAdvantageDto[];

	@IsString()
	seoText: string;

	@IsString()
	tagsTitle: string;

	@IsString({ each: true })
	tags: string[];
}
