import {
	Controller,
	Body,
	Param,
	Get,
	Post,
	Patch,
	Delete,
	HttpCode,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEmail } from 'src/decorators/user-email.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) { }

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateProductDto, @UserEmail() email: string) {
		return this.productService.create(dto);
	}

	@Get(':id')
	async get(@Param('id') id: string) {
		const product = this.productService.getById(id);

		if (!product) {
			throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return product;
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
