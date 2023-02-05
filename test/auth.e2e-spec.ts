import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { INCORRECT_PASSWORD_ERROR, USER_NOT_FOUND_ERROR } from '../src/auth/auth.constants';

const loginDto: AuthDto = {
	login: 'test@test.com',
	password: 'test'
}

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) -  success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.accessToken).toBeDefined();
			})
	});

	it('/auth/login (POST) -  fail', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({
				...loginDto,
				login: 'test@test.ru'
			})
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(USER_NOT_FOUND_ERROR);
			})
	});

	it('/auth/login (POST) -  fail', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({
				...loginDto,
				password: 'incorrect'
			})
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(INCORRECT_PASSWORD_ERROR);
			})
	});

	afterAll(() => {
		disconnect();
	});
});
