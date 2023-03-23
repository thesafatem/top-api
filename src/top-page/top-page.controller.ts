import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { TopPageService } from './top-page.service';
import { HhService } from 'src/hh/hh.service';
import { Cron } from '@nestjs/schedule';
import { FindTopPageQueryDto } from './dto/find.query.dto';

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
	@Get('/')
	async find(
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			}),
		)
		dto: FindTopPageQueryDto,
	) {
		if (dto.firstCategory) {
			return this.topPageService.findByCategory(dto.firstCategory);
		}
		if (dto.alias) {
			return this.topPageService.findByAlias(dto.alias);
		}
		if (dto.text) {
			return this.topPageService.findByText(dto.text);
		}
		return this.topPageService.findAll();
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

	@Cron('0 0 * * *')
	async updateHhData() {
		const data = await this.topPageService.findByHhDate(new Date());
		for (let page of data) {
			const hhData = await this.hhService.getData(page.category);
			page.hh = hhData;
			this.topPageService.updateById(page._id, page);
		}
	}
}
