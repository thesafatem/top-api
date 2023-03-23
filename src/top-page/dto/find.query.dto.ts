import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TopCategory } from '../models/top-page.model';

export class FindTopPageQueryDto {
	@IsOptional()
	@IsString()
	alias: string;

	@IsOptional()
	@IsString()
	text: string;

	@IsOptional()
	@IsEnum(TopCategory)
	firstCategory: TopCategory;
}
