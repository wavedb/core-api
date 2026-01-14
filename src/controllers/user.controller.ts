import type { Context } from "hono";
import { ValidationError } from "@/exceptions";
import { UserService } from "@/services/user.service";
import type { AuthVariables } from "@/types/variables";
import { userApiKeyValidation } from "@/validations/user.validation";

export async function createUserApiKeyController(
	c: Context<{ Variables: AuthVariables }>,
) {
	const userId = c.get("userId") as string;
	const body = await c.req.json();
	const bodyValidated = await userApiKeyValidation(body);
	if (!bodyValidated.success) {
		throw new ValidationError(
			bodyValidated.error.issues,
			"validation failed",
			400,
		);
	}

	const userService = new UserService();
	const data = await userService.createApiKeyForUser(
		bodyValidated.data.name,
		userId,
	);

	return c.json({
		message: "api key created successfully",
		data: data,
	});
}
