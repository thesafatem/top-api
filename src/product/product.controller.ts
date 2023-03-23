import {
	Controller,
	Body,
	Param,
	Get,
	Post,
	Patch,
	Delete,
	HttpCode,
	UsePipes,
	ValidationPipe,
	NotFoundException,
	Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { ProductService } from './product.service';
import { Product } from './models/product.model';
import { FindProductQueryDto } from './dto/find-product.query.dto';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('/')
	async create(
		@Body() dto: CreateProductDto,
		@UserEmail() email: string,
	) {
		return this.productService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const product = await this.productService.findById(id);

		if (!product) {
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}

		return product;
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.productService.deleteById(id);

		if (!deletedDoc) {
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: Product,
	) {
		const updatedProduct = await this.productService.updateById(
			id,
			dto,
		);
		if (!updatedProduct) {
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}

		return updatedProduct;
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Get('/')
	async find(
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			}),
		)
		dto: FindProductQueryDto,
	) {
		return this.productService.findWithReviews(dto);
	}
}
