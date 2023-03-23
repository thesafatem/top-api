import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HhModule } from 'src/hh/hh.module';
import { TopPage, TopPageSchema } from './models/top-page.model';
import { TopPageController } from './top-page.controller';
import { TopPageService } from './top-page.service';

@Module({
	controllers: [TopPageController],
	imports: [
		MongooseModule.forFeature([
			{
				name: TopPage.name,
				schema: TopPageSchema,
			},
		]),
		HhModule,
	],
	providers: [TopPageService],
	exports: [TopPageService],
})
export class TopPageModule {}
