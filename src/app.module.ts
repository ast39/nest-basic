import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join('.dev.env'),
		}),
		PrismaModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
