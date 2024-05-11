import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { UserFilterDto } from './dto/user.filter.dto';
import { UserEmailExistException, UserNotFoundException } from './exeptions/user.exeptions';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private userRepo: UserRepository,
	) {}

	// Список пользователей
	async userList(url: string, userFilter: UserFilterDto): Promise<PaginationInterface<UserDto>> {
		const page = Number(userFilter.page ?? 1);
		const limit = Number(userFilter.limit ?? 10);

		const users = await this.prisma.$transaction(async (tx) => {
			const users = await this.userRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: {
						status: userFilter.status != null ? userFilter.status : undefined,
					},
					orderBy: { userId: 'desc' },
				},
				tx,
			);

			if (!users) {
				throw new UserNotFoundException();
			}

			return users;
		});

		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.userRepo.totalRows(
				{
					where: {
						status: userFilter.status != null ? userFilter.status : undefined,
					},
				},
				tx,
			);
		});

		return {
			data: users.map((user) => plainToClass(UserDto, user)),
			meta: {
				currentPage: page,
				lastPage: Math.ceil(totalRows / limit),
				perPage: limit,
				from: (page - 1) * limit + 1,
				to: (page - 1) * limit + limit,
				total: totalRows,
				path: url,
			},
		};
	}

	// Пользователь по ID
	async getUser(userId: number): Promise<UserDto | null> {
		return this.prisma.$transaction(async (tx) => {
			const user = await this.userRepo.show({ userId: Number(userId) }, tx);
			if (!user) {
				throw new UserNotFoundException();
			}

			return plainToClass(UserDto, user);
		});
	}

	// Пользователь по E-mail
	async getUserByEmail(email: string): Promise<UserDto | null> {
		return this.prisma.$transaction(async (tx) => {
			const users = await this.userRepo.index(
				{
					where: {
						email: email,
					},
				},
				tx,
			);

			return users[0] ?? null;
		});
	}

	// Добавление пользователя
	async createUser(data: UserCreateDto): Promise<UserDto> {
		return this.prisma.$transaction(async (tx) => {
			const user = await this.getUserByEmail(data.email);

			if (user) {
				throw new UserEmailExistException();
			}

			data.password = data.password ?? Math.random().toString(36).slice(-8);
			data.password = await bcrypt.hash(data.password, 10);
			const newUser = await this.userRepo.store(data, tx);

			return plainToClass(UserDto, newUser);
		});
	}

	// Обновление пользователя
	async updateUser(userId: number, data: UserUpdateDto): Promise<UserDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.getUser(userId);
			const user = await this.userRepo.update(
				{
					where: { userId: Number(userId) },
					data: data,
				},
				tx,
			);

			return plainToClass(UserDto, user);
		});
	}

	// Удаление пользователя
	async deleteUser(userId: number): Promise<UserDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.getUser(userId);
			const user = await this.userRepo.destroy({ userId: Number(userId) }, tx);

			return plainToClass(UserDto, user);
		});
	}
}
