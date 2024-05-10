import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import process from 'process';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);
	const APP_PORT = config.get('APP_PORT') || 3000;
	const SWAGGER_PREFIX = config.get('API_PREFIX') + config.get('SWAGGER_PATH');

	app.setGlobalPrefix(config.get('API_PREFIX'));
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());

	app.enableCors({
		origin: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
		credentials: true,
	});

	const docs = new DocumentBuilder()
		.setTitle(process.env.APP_TITLE || 'API')
		.setDescription(process.env.APP_DESC || 'API endpoints description')
		.setVersion(process.env.APP_VERSION || '1.0.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, docs);
	SwaggerModule.setup(SWAGGER_PREFIX, app, document, {
		swaggerOptions: { persistAuthorization: true },
	});

	await app.listen(APP_PORT, () => console.log(`APP started on port ${APP_PORT}`));
}

bootstrap();
