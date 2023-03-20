import { index, prop } from '@typegoose/typegoose';
import {
	Base,
	TimeStamps,
} from '@typegoose/typegoose/lib/defaultClasses';

export enum TopCategory {
	Courses,
	Services,
	Books,
	Goods,
}

export class HhData {
	@prop()
	count: number;

	@prop()
	juniorSalary: number;

	@prop()
	middleSalary: number;

	@prop()
	seniorSalary: number;

	@prop()
	updatedAt: Date;
}

export class TopPageAdvantage {
	@prop()
	title: string;

	@prop()
	description: string;
}

export interface TopPageModel extends Base {}
@index({ title: 'text', seoText: 'text' })
export class TopPageModel extends TimeStamps {
	@prop({ enum: TopCategory })
	firstCategory: TopCategory;

	@prop()
	secondCategory: string;

	@prop({ uniqie: true })
	alias: string;

	@prop()
	title: string;

	@prop()
	category: string;

	@prop({ type: () => HhData })
	hh?: HhData;

	@prop({ type: () => [TopPageAdvantage] })
	advantages: TopPageAdvantage[];

	@prop()
	seoText: string;

	@prop()
	tagsTitle: string;

	@prop({ type: () => [String] })
	tags: string[];
}
