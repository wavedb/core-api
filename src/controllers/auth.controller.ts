import type { Context } from "hono";
import { ValidationError } from "@/exceptions";
import AuthService from "@/services/auth.service";
import type { RegisterValidationType } from "@/validations/auth.validation";
import {
	loginValidation,
	registerValidation,
} from "@/validations/auth.validation";

export async function registerController(c: Context) {
	const body = await c.req.json();
	const bodyValidated = await registerValidation(body);

	if (!bodyValidated.success) {
		throw new ValidationError(
			bodyValidated.error.issues,
			"validation failed",
			400,
		);
	}

	const authService = new AuthService();
	await authService.registerUser(bodyValidated.data as RegisterValidationType);

	return c.json({
		message: "user registered successfully",
		data: bodyValidated.data,
	});
}

export async function loginController(c: Context) {
	const body = await c.req.json();
	const bodyValidated = await loginValidation(body);

	if (!bodyValidated.success) {
		throw new ValidationError(
			bodyValidated.error.issues,
			"validation failed",
			400,
		);
	}

	const authService = new AuthService();
	const user = await authService.loginUser(bodyValidated.data);

	return c.json({
		message: "user logged in successfully",
		data: {
			access_token: user.token,
		},
	});
}
