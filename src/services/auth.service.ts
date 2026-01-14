import { UserAlreadyExistsError, UserNotFoundError } from "@/exceptions";
import { auth } from "@/helpers/auth";
import { generateJWT } from "@/helpers/jwt";
import { prisma } from "@/helpers/prisma";
import type {
	LoginValidationType,
	RegisterValidationType,
} from "@/validations/auth.validation";

export default class AuthService {
	async comparePassword(password: string, hash: string): Promise<boolean> {
		return await Bun.password.verify(password, hash, "bcrypt");
	}

	async toHash(password: string): Promise<string> {
		return await Bun.password.hash(password, "bcrypt");
	}

	async findUserByEmail(email: string) {
		return await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
	}

	async generateAccessToken(userId: string): Promise<string> {
		const access_token = await generateJWT(userId);
		return access_token;
	}

	async registerUser(data: RegisterValidationType) {
		return await auth.api.signUpEmail({
			body: {
				email: data.email,
				name: data.name,
				password: data.password,
			},
		});
	}

	async loginUser(data: LoginValidationType) {
		return await auth.api.signInEmail({
			body: {
				email: data.email,
				password: data.password,
			},
		});
	}
}
