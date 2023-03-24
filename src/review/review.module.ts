import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramModule } from '../telegram/telegram.module';
import { Review, ReviewSchema } from './models/review.model';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
	controllers: [ReviewController],
	imports: [
		MongooseModule.forFeature([
			{
				name: Review.name,
				schema: ReviewSchema,
			},
		]),
		TelegramModule,
	],
	providers: [ReviewService],
})
export class ReviewModule {}
