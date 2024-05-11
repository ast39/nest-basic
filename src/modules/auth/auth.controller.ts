import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from '../../common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { IJwtToken } from '../../common/interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../user/dto/user.dto';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { UserCreateDto } from '../user/dto/user.create.dto';
import { Request } from 'express';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: 'Регистрация' })
	@ApiOkResponse({
		description: 'Регистрация',
		type: IJwtToken,
		isArray: false,
		status: 201,
	})
	@Post('signup')
	async registration(@Body() createUser: UserCreateDto): Promise<IJwtToken> {
		return await this.authService.signUp(createUser);
	}

	@ApiOperation({ summary: 'Авторизация' })
	@ApiOkResponse({
		description: 'Авторизация',
		type: IJwtToken,
		isArray: false,
		status: 200,
	})
	@Post('signin')
	async login(@Body() loginDto: LoginDto): Promise<IJwtToken> {
		return await this.authService.signIn(loginDto);
	}

	@ApiOperation({ summary: 'Обновление токенов' })
	@ApiOkResponse({
		description: 'Обновление токенов',
		type: IJwtToken,
		isArray: false,
		status: 200,
	})
	@Get('refresh')
	refreshTokens(@Query() query: { token: string }) {
		const { token } = query;
		return this.authService.refreshTokens(token);
	}

	@ApiOperation({ summary: 'Выход из системы' })
	@ApiOkResponse({
		description: 'Выход из системы',
		type: Boolean,
		status: 200,
	})
	@ApiBearerAuth()
	@UseGuards(AccessTokenGuard)
	@Get('logout')
	async logout(@UserId() userId: number): Promise<UserDto> {
		return await this.authService.logout(userId);
	}

	@ApiOperation({ summary: 'Информация обо мне' })
	@ApiOkResponse({
		description: 'Информация обо мне',
		type: UserDto,
		isArray: false,
		status: 200,
	})
	@ApiBearerAuth()
	@UseGuards(AccessTokenGuard)
	@Get('me')
	async me(@UserId() userId: number): Promise<UserDto> {
		return await this.authService.me(userId);
	}

	@ApiOperation({ summary: 'Проверка авторизации' })
	@Get('check')
	async check(@Req() request: Request): Promise<{ auth: boolean }> {
		return await this.authService.check(request);
	}
}
