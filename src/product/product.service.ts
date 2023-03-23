import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './models/product.model';
import {
	Review,
	ReviewDocument,
} from 'src/review/models/review.model';
import { FindProductQueryDto } from './dto/find-product.query.dto';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name)
		private productModel: Model<ProductDocument>,
	) {}

	async create(dto: CreateProductDto): Promise<ProductDocument> {
		const newProduct = new this.productModel(dto);
		return newProduct.save();
	}

	async findById(id: string): Promise<ProductDocument | null> {
		return this.productModel.findById(id).exec();
	}

	async deleteById(id: string): Promise<ProductDocument | null> {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProductDto) {
		return this.productModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
	}

	async findWithReviews(dto: FindProductQueryDto) {
		const aggregationArray = this.getFindAggregationArray(dto);

		return this.productModel
			.aggregate(aggregationArray)
			.exec() as unknown as (ProductDocument & {
			review: ReviewDocument[];
			reviewCount: number;
			reviewAverageRating: number;
		})[];
	}

	private getFindAggregationArray(dto: FindProductQueryDto): any[] {
		const aggregations: any[] = [
			{
				$sort: {
					_id: 1,
				},
			},
			{
				$lookup: {
					from: Review.name,
					localField: '_id',
					foreignField: 'productId',
					as: 'reviews',
				},
			},
			{
				$addFields: {
					reviewCount: { $size: '$reviews' },
					reviewAverageRating: { $avg: '$reviews.rating' },
					reviews: {
						$function: {
							body: `function(reviews) {
									reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
									return reviews
								}`,
							args: ['$reviews'],
							lang: 'js',
						},
					},
				},
			},
		];

		if (dto.category) {
			aggregations.push({
				$match: {
					categories: dto.category,
				},
			});
		}
		if (dto.limit) {
			aggregations.push({
				$limit: dto.limit,
			});
		}

		return aggregations;
	}
}
