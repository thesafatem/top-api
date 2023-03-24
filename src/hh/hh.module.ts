import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TopPageModule } from '../top-page/top-page.module';
import { HhService } from './hh.service';

@Module({
	providers: [HhService],
	imports: [ConfigModule, HttpModule],
	exports: [HhService],
})
export class HhModule {}
