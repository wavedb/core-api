import { auth } from "@/helpers/auth";

export class UserService {
	async createApiKeyForUser(name: string, userId: string) {
		return await auth.api.createApiKey({
			body: {
				name: name,
				userId: userId,
				rateLimitEnabled: false
			}
		})
	}

	async getUserByApiKey(headers: Headers) {
		return await auth.api.getSession({
			headers: headers
		})
	}
}
