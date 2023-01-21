import {
	Controller,
	Body,
	Param,
	Get,
	Post,
	Patch,
	Delete,
	HttpCode,
	Inject,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { throws } from 'assert';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(
		@Inject(ProductService) private readonly productService: ProductService,
	) { }

	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto);
	}

	@Get(':id')
	async get(@Param('id') id: string) {
		const product = this.productService.getById(id);

		if (!product) {
			throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return product
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedDoc = await this.productService.deleteById(id);

		if (!deletedDoc) {
			throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	//   @Patch(':id')
	//   async patch(@Param('id') id: string, @Body() dto: ProductModel) {}

	//   @HttpCode(200)
	//   @Post()
	//   async find(@Body() dto: FindProductDto) {}
}
