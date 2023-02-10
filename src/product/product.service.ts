import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ReviewModel } from '../review/review.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: ModelType<ProductModel>,
  ) {}

  async create(dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
    return this.productModel.create(dto);
  }

  async findById(id: string): Promise<DocumentType<ProductModel> | null> {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<DocumentType<ProductModel> | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true });
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
            from: 'Review',

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
      .exec() as unknown as (ProductModel & {
      review: ReviewModel[];
      reviewCount: number;
      reviewAverageRating: number;
    })[];
  }
}
