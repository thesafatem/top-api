import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	CreateTopPageDto,
	TopCategory,
} from './dto/create-top-page.dto';
import { FindByCategoryDto } from './dto/find-by-category.output.dto';
import { addDays } from 'date-fns';
import { Model, Types } from 'mongoose';
import { TopPage, TopPageDocument } from './models/top-page.model';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(TopPage.name)
		private topPageModel: Model<TopPageDocument>,
	) {}

	async create(dto: CreateTopPageDto): Promise<TopPageDocument> {
		const newTopPage = new this.topPageModel(dto);
		return newTopPage.save();
	}

	async findById(id: string): Promise<TopPageDocument | null> {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string): Promise<TopPageDocument[]> {
		return this.topPageModel.find({ alias }).exec();
	}

	async findAll(): Promise<TopPageDocument[]> {
		return this.topPageModel.find({}).exec();
	}

	async findByCategory(
		firstCategory: TopCategory,
	): Promise<FindByCategoryDto[]> {
		return this.topPageModel
			.aggregate()
			.match({ firstCategory })
			.group({
				_id: { secondCategory: '$secondCategory' },
				pages: {
					$push: { alias: '$alias', title: '$title', _id: '$_id' },
				},
			})
			.exec();
	}

	async findByText(text: string): Promise<TopPageDocument[]> {
		return this.topPageModel
			.find({
				$text: {
					$search: text,
					$caseSensitive: false,
				},
			})
			.exec();
	}

	async deleteById(id: string): Promise<TopPageDocument | null> {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}

	async updateById(
		id: string | Types.ObjectId,
		dto: CreateTopPageDto,
	): Promise<TopPageDocument | null> {
		return this.topPageModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
	}

	async findByHhDate(date: Date): Promise<TopPageDocument[]> {
		return this.topPageModel
			.find({
				firstCategory: 0,
				$or: [
					{
						'hh.updatedAt': {
							$lt: addDays(date, -1),
						},
					},
					{
						'hh.updatedAt': { $exists: false },
					},
				],
			})
			.exec();
	}
}
