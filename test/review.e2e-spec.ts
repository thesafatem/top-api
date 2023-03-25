import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
	login: 'test@test.com',
	password: 'test',
};

const testDto: CreateReviewDto = {
	name: 'test',
	title: 'title',
	description: 'description',
	rating: 5,
};

describe('ReviewController (e2e)', () => {
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

	it('/product/:productId/review (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/product/' + productId + '/review')
			.set('Authorization', 'Bearer ' + token)
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/product/:productId/review (POST) - fail', async () => {
		return request(app.getHttpServer())
			.post('/product/' + productId + '/review')
			.set('Authorization', 'Bearer ' + token)
			.send({ ...testDto, rating: 0 })
			.expect(400)
			.then(({ body }: request.Response) => {
				console.log(body);
			});
	});

	it('/product/:productId/review (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/product/' + productId + '/review')
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
			});
	});

	it('/product/:productId/review (GET) - fail', async () => {
		const randomProductId = new Types.ObjectId().toHexString();
		return request(app.getHttpServer())
			.get('/product/' + randomProductId + '/review')
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
			});
	});

	it('/product/:productId/review/:reviewId (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/product/' + productId + '/review/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
	});

	it('/product/:productId/review/:reviewId (DELETE) - fail', () => {
		const randomProductId = new Types.ObjectId().toHexString();
		return request(app.getHttpServer())
			.delete('/product/' + productId + '/review/' + randomProductId)
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: REVIEW_NOT_FOUND,
				error: 'Not Found',
			});
	});

	afterAll(() => {
		disconnect();
	});
});
