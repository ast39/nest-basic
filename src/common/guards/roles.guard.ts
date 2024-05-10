import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(ctx: ExecutionContext) {
		const request = ctx.switchToHttp().getRequest();
		const _userRoles = request.headers['user_roles'] ?? null;
		const userRoles = !_userRoles ? null : _userRoles.split(',').map((role: string) => role.trim());
		const roles = this.reflector.get<string[]>('roles', ctx.getHandler());

		const matchRoles = (roles?: string[], userRoles?: string[]) => {
			let check = false;

			if (!roles) {
				check = true;
			}

			if (!userRoles) {
				return check;
			}

			roles.forEach((role: string) => {
				if (userRoles.includes(role)) {
					check = true;
				}
			});

			return check;
		};

		return matchRoles(roles, userRoles);
	}
}
