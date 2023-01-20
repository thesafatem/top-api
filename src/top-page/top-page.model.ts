import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose/lib/prop';

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
}

export class TopPageAdvantage {
	@prop()
	title: string;

	@prop()
	description: string;
}

export interface TopPageModel extends Base { }
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
