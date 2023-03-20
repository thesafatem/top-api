import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { TopPageService } from './top-page.service';
import { HhService } from 'src/hh/hh.service';
import { Cron } from '@nestjs/schedule';

@Controller('top-page')
export class TopPageController {
	constructor(
		private readonly topPageService: TopPageService,
		private readonly hhService: HhService,
	) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('/')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const topPage = await this.topPageService.findById(id);

		if (!topPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return topPage;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const page = await this.topPageService.deleteById(id);

		if (!page) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('/by-alias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const page = await this.topPageService.findByAlias(alias);
		if (!page) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return page;
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateTopPageDto,
	) {
		const updatedTopPage = await this.topPageService.updateById(
			id,
			dto,
		);
		if (!updatedTopPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return updatedTopPage;
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto.firstCategory);
	}

	@UseGuards(JwtAuthGuard)
	@Get('text-search/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}

	@Cron('0 0 * * *')
	async test() {
		const data = await this.topPageService.findByHhDate(new Date());
		for (let page of data) {
			const hhData = await this.hhService.getData(page.category);
			page.hh = hhData;
			this.topPageService.updateById(page._id, page);
		}
	}
}
