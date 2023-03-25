import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';
import { TelegramService } from '../telegram/telegram.service';

@Controller()
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService,
	) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('/')
	async create(
		@Param('productId', IdValidationPipe) productId: string,
		@Body() dto: CreateReviewDto,
	) {
		const review = this.reviewService.create(productId, dto);
		const message = this.getReviewCreateMessage(productId, dto);
		this.telegramService.sendMessage(message);
		return review;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':reviewId')
	async delete(
		@Param('productId', IdValidationPipe) productId: string,
		@Param('reviewId', IdValidationPipe) reviewId: string,
	) {
		const deletedDoc = await this.reviewService.deleteById(reviewId);

		if (!deletedDoc) {
			throw new NotFoundException(REVIEW_NOT_FOUND);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('/')
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string,
	) {
		return this.reviewService.findByProductId(productId);
	}

	private getReviewCreateMessage(
		productId: string,
		dto: CreateReviewDto,
	): string {
		return (
			`Name: ${dto.name}\n` +
			`Heading: ${dto.title}\n` +
			`Description: ${dto.description}\n` +
			`Rating: ${dto.rating}\n` +
			`Product ID: ${productId}\n`
		);
	}
}
