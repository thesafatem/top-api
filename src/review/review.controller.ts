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
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService,
	) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('/')
	async create(@Body() dto: CreateReviewDto) {
		const review = this.reviewService.create(dto);
		const message = this.getReviewCreateMessage(dto);
		this.telegramService.sendMessage(message);
		return review;
	}

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.deleteById(id);

		if (!deletedDoc) {
			throw new NotFoundException(REVIEW_NOT_FOUND);
		}
	}

	@Get('byProduct/:productId')
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string,
	) {
		return this.reviewService.findByProductId(productId);
	}

	private getReviewCreateMessage(dto: CreateReviewDto): string {
		return (
			`Name: ${dto.name}\n` +
			`Heading: ${dto.title}\n` +
			`Description: ${dto.description}\n` +
			`Rating: ${dto.rating}\n` +
			`Product ID: ${dto.productId}\n`
		);
	}
}
