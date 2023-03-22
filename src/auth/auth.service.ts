import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';
import { compare, genSalt, hash } from 'bcryptjs';
import {
	INCORRECT_PASSWORD_ERROR,
	USER_NOT_FOUND_ERROR,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(10);

		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: await hash(dto.password, salt),
		});

		return newUser.save();
	}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async validateUser(
		email: string,
		password: string,
	): Promise<Pick<UserModel, 'email'>> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}
		const isCorrectPassword = await compare(
			password,
			user.passwordHash,
		);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(INCORRECT_PASSWORD_ERROR);
		}

		return { email: user.email };
	}

	async login(email: string) {
		const payload = { email };

		return {
			accessToken: await this.jwtService.signAsync(payload),
		};
	}
}
