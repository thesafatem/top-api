import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './models/review.model';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(Review.name)
		private reviewModel: Model<ReviewDocument>,
	) {}

	async create(dto: CreateReviewDto): Promise<Review> {
		const newReview = new this.reviewModel(dto);
		return newReview.save();
	}

	async deleteById(id: string): Promise<Review | null> {
		return this.reviewModel.findByIdAndDelete(id).exec();
	}

	async findByProductId(productId: string): Promise<Review[]> {
		return this.reviewModel
			.find({ productId: new Types.ObjectId(productId) })
			.exec();
	}

	async deleteByProductId(productId: string) {
		return this.reviewModel
			.deleteMany({ productId: new Types.ObjectId(productId) })
			.exec();
	}
}
