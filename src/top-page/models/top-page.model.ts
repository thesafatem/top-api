import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
	Document,
	HydratedDocument,
	SchemaTimestampsConfig,
} from 'mongoose';

export enum TopCategory {
	Courses,
	Services,
	Books,
	Goods,
}

@Schema({ _id: false })
export class TopPageAdvantage {
	@Prop()
	title: string;

	@Prop()
	description: string;
}

export const TopPageAdvantageSchema =
	SchemaFactory.createForClass(TopPageAdvantage);

@Schema({ _id: false })
export class HhData {
	@Prop()
	count: number;

	@Prop()
	juniorSalary: number;

	@Prop()
	middleSalary: number;

	@Prop()
	seniorSalary: number;

	@Prop()
	updatedAt?: Date;
}

export const HhDataSchema = SchemaFactory.createForClass(HhData);

@Schema({ timestamps: true })
export class TopPage {
	@Prop({ enum: TopCategory })
	firstCategory: TopCategory;

	@Prop()
	secondCategory: string;

	@Prop({ uniqie: true })
	alias: string;

	@Prop()
	title: string;

	@Prop()
	category: string;

	@Prop({ type: HhDataSchema })
	hh?: HhData;

	@Prop({ type: [TopPageAdvantageSchema] })
	advantages: TopPageAdvantage[];

	@Prop()
	seoText: string;

	@Prop()
	tagsTitle: string;

	@Prop([String])
	tags: string[];

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export const TopPageSchema = SchemaFactory.createForClass(TopPage);

TopPageSchema.index({ title: 'text', seoText: 'text' });

export type TopPageDocument = HydratedDocument<TopPage>;
