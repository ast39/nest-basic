import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@ApiProperty({
		title: 'E-mail',
		description: 'E-mail пользователя',
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({
		title: 'Пароль',
		description: 'Пароль пользователя',
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	password: string;
}
