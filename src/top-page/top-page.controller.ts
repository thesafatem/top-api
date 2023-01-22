import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const topPage = await this.topPageService.getById(id);

    if (!topPage) {
      throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return topPage;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const topPage = await this.topPageService.deleteById(id);

    if (!topPage) {
      throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  // @Patch(':id')
  // async patch(@Param() id: string, @Body() dto: TopPageModel) { }

  // @HttpCode(200)
  // @Post()
  // async find(@Body() dto: FindTopPageDto) { }
}
