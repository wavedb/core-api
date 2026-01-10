import { UserAlreadyExistsError } from "@/exceptions";
import { prisma } from "@/helpers/prisma";
import type { RegisterValidationType } from "@/validations/auth/register.validation";

export default class AuthService {
	async toHash(password: string): Promise<string> {
		return await Bun.password.hash(password)
	}

	async findUserByEmail(email: string) {
		return await prisma.user.findFirst({
			where: {
				email: email
			}
		})
	}

	async registerUser(data: RegisterValidationType) {
		const user = await this.findUserByEmail(data.email)
		if (user) {
			throw new UserAlreadyExistsError("user with this email already exists", 400)
		}

		return await prisma.user.create({
			data: {
				email: data.email,
				name: data.name,
				password: await this.toHash(data.password)
			}
		})
	}
}
