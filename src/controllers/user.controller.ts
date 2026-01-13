import type { Context } from "hono";
import { UserService } from "@/services/user.service";
import type { AuthVariables } from "@/types/variables";

export async function createUserApiKeyController(c: Context<{ Variables: AuthVariables }>) {
	const userId = c.get("userId") as string

	const userService = new UserService()
	const data = await userService.createApiKeyForUser(userId)

	return c.json({
		message: "api key created successfully",
		data: data
	})
}
