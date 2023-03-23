import { IsEnum } from 'class-validator';
import { TopCategory } from '../models/top-page.model';
export class FindTopPageDto {
	@IsEnum(TopCategory)
	firstCategory: TopCategory;
}
