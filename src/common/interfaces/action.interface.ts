import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IActionInterface<T = NonNullable<unknown>> {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		title: 'Статус',
		description: 'Статус ответа',
		type: String,
		required: true,
	})
	status: 'success' | 'error';

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		title: 'Сообщение',
		description: 'Сообщение',
		type: String,
		required: true,
	})
	message: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		title: 'Тип',
		description: 'Тип ответа',
		type: String,
		required: false,
	})
	type?: 'form' | 'notification' | 'common';

	@IsOptional()
	@ApiProperty({
		title: 'Вложение',
		description: 'Вложение',
		type: Object,
		required: false,
	})
	result?: T;
}
