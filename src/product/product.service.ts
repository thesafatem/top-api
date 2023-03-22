import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { Product, ProductDocument } from './models/product.model';
import {
	Review,
	ReviewDocument,
} from 'src/review/models/review.model';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name)
		private productModel: Model<ProductDocument>,
	) {}

	async create(dto: CreateProductDto): Promise<Product> {
		const newProduct = new this.productModel(dto);
		return newProduct.save();
	}

	async findById(id: string): Promise<Product | null> {
		return this.productModel.findById(id).exec();
	}

	async deleteById(id: string): Promise<Product | null> {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProductDto) {
		return this.productModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
	}

	async findWithReviews(dto: FindProductDto) {
		return this.productModel
			.aggregate([
				{
					// take if array contains some element
					$match: {
						categories: dto.category,
					},
				},
				{
					// by default sort is not stable
					$sort: {
						_id: 1,
					},
				},
				{
					// limit the number of retrieved products
					$limit: dto.limit,
				},
				{
					// go to another collection
					$lookup: {
						// name of that collection
						from: Review.name,

						// field in the inner collection
						localField: '_id',

						// field in the main collection
						foreignField: 'productId',

						// alias
						as: 'reviews',
					},
				},
				{
					// add some fields to the output
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
			])
			.exec() as unknown as (ProductDocument & {
			review: ReviewDocument[];
			reviewCount: number;
			reviewAverageRating: number;
		})[];
	}
}
