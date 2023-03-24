import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Types, disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import {
	CreateTopPageDto,
	HhDataDto,
} from '../src/top-page/dto/create-top-page.dto';
import { TOP_PAGE_NOT_FOUND } from '../src/top-page/top-page.constants';

const loginDto: AuthDto = {
	login: 'test@test.com',
	password: 'test',
};

const hhData: HhDataDto = {
	count: 1,
	juniorSalary: 2,
	middleSalary: 3,
	seniorSalary: 4,
};

const testDto: CreateTopPageDto = {
	firstCategory: 1,
	secondCategory: 'second category',
	alias: 'testAlias',
	title: 'test title',
	category: 'test category',
	hh: hhData,
	advantages: [
		{
			title: 'test advantage title',
			description: 'test advantages description',
		},
	],
	seoText: 'test seo text',
	tagsTitle: 'test tags title',
	tags: ['test tag 1', 'test tag 2'],
};

describe('TopPageController (e2e)', () => {
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

	it('/top-page (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/top-page')
			.set('Authorization', 'Bearer ' + token)
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/top-page (POST) - fail', async () => {
		return request(app.getHttpServer())
			.post('/top-page')
			.set('Authorization', 'Bearer ' + token)
			.send({
				...testDto,
				hh: {
					...hhData,
					juniorSalary: -1,
				},
			})
			.expect(400);
	});

	it('/top-page/:id (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/top-page/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.then(({ body: { _id } }: request.Response) => {
				expect(_id).toBeDefined();
			});
	});

	it('/top-page/:id (GET) - fail', async () => {
		return request(app.getHttpServer())
			.get('/top-page/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: TOP_PAGE_NOT_FOUND,
				error: 'Not Found',
			});
	});

	it('/top-page (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/top-page')
			.set('Authorization', 'Bearer ' + token)
			.query({
				firstCategory: testDto.firstCategory,
			})
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeGreaterThanOrEqual(1);
			});
	});

	it('/top-page (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/top-page')
			.query({
				alias: testDto.alias,
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeGreaterThanOrEqual(1);
			});
	});

	it('/top-page (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/top-page')
			.query({
				text: testDto.title.split(' ')[0],
			})
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeGreaterThanOrEqual(1);
			});
	});

	it('/top-page/:id (PATCH) - success', async () => {
		return request(app.getHttpServer())
			.patch('/top-page/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.send({
				...testDto,
				firstCategory: 2,
			})
			.expect(200);
	});

	it('/top-page/:id (PATCH) - fail', async () => {
		return request(app.getHttpServer())
			.patch('/top-page/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.send(testDto)
			.expect(404, {
				statusCode: 404,
				message: TOP_PAGE_NOT_FOUND,
				error: 'Not Found',
			});
	});

	it('/top-page/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/top-page/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
	});

	it('/top-page/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete('/top-page/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: TOP_PAGE_NOT_FOUND,
				error: 'Not Found',
			});
	});

	afterAll(() => {
		disconnect();
	});
});
