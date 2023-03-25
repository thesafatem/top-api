import { IsString, IsNumber, Max, Min } from 'class-validator';

export class CreateReviewDto {
	// Decorators for validation of values from body
	@IsString()
	name: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	// Customize validation error message
	@Min(1, { message: 'Rating must not be less than 1' })
	@Max(5)
	@IsNumber()
	rating: number;
}
