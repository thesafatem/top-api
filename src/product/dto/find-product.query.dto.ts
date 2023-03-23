import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindProductQueryDto {
	@IsOptional()
	@IsString()
	category: string;

	@IsOptional()
	@IsNumber()
	limit: number;
}
