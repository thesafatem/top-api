import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
	CreateProductDto,
	ProductCharacteristicDto,
} from '../src/product/dto/create-product.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { Types, disconnect } from 'mongoose';
import { PRODUCT_NOT_FOUND } from '../src/product/product.constants';

const loginDto: AuthDto = {
	login: 'test@test.com',
	password: 'test',
};

const productCharacteristics: ProductCharacteristicDto[] = [
	{
		name: 'name',
		value: 'value',
	},
];

const productDto: CreateProductDto = {
	image: 'test.png',
	title: 'test product',
	price: 1,
	oldPrice: 2,
	credit: 3,
	description: 'test product description',
	advantages: 'test advantages',
	disadvantages: 'test disadvantages',
	categories: ['test category 1', 'test category 2'],
	tags: ['test tag 1', 'test tag 2'],
	characteristics: productCharacteristics,
};

describe('ProductController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule =
			await Test.createTestingModule({
				imports: [AppModule],
			}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const {
			body: { accessToken },
		} = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto);

		token = accessToken;
	});

	it('/product (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/product')
			.set('Authorization', 'Bearer ' + token)
			.send(productDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/product (POST) - fail', async () => {
		return request(app.getHttpServer())
			.post('/product')
			.set('Authorization', 'Bearer ' + token)
			.send({
				...productDto,
				price: -10,
			})
			.expect(400)
			.then(({ body }: request.Response) => {
				console.log(body);
			});
	});

	it('/product/:id (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/product/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
	});

	it('/product/:id (GET) - fail', async () => {
		return request(app.getHttpServer())
			.get('/product/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: PRODUCT_NOT_FOUND,
				error: 'Not Found',
			});
	});

	it('/product/:id (PATCH) - success', async () => {
		return request(app.getHttpServer())
			.patch('/product/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.send({
				...productDto,
				price: 100,
			})
			.expect(200);
	});

	it('/product/:id (PATCH) - fail', async () => {
		return request(app.getHttpServer())
			.patch('/product/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.send({
				...productDto,
				price: 100,
			})
			.expect(404, {
				statusCode: 404,
				message: PRODUCT_NOT_FOUND,
				error: 'Not Found',
			});
	});

	it('/product/:id (DELETE) - success', async () => {
		return request(app.getHttpServer())
			.delete('/product/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
	});

	it('/product/:id (DELETE) - fail', async () => {
		return request(app.getHttpServer())
			.delete('/product/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: PRODUCT_NOT_FOUND,
				error: 'Not Found',
			});
	});

	afterAll(() => {
		disconnect();
	});
});
