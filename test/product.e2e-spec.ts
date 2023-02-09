import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from '../src/product/dto/create-product.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { Types, disconnect } from 'mongoose';
import { PRODUCT_NOT_FOUND } from '../src/product/product.constants';

const loginDto: AuthDto = {
  login: 'test@test.com',
  password: 'test',
};

const productDto: CreateProductDto = {
  image: 'test.png',
  title: 'test product',
  price: 1,
  oldPrice: 2,
  credit: 3,
  calculatedRating: 4,
  description: 'product description',
  advantages: 'advantages',
  disadvantages: 'disadvantages',
  categories: ['category 1', 'category 2'],
  tags: ['tag 1', 'tag 2'],
  characteristics: [
    {
      name: 'name',
      value: 'value',
    },
  ],
};

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const {
      body: { accessToken },
    } = await request(app.getHttpServer()).post('/auth/login').send(loginDto);

    token = accessToken;
  });

  it('/product/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/product/create')
      .set('Authorization', 'Bearer ' + token)
      .send(productDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
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
      });
  });

  afterAll(() => {
    disconnect();
  });
});
