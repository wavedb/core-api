import type { Context } from "hono";
import AuthService from "@/services/auth.service";
import { registerValidation } from "@/validations/auth/register.validation";

export async function registerController(c: Context) {
	const body = await c.req.json()
	const bodyValidated = await registerValidation(body)
	const authService = new AuthService()

	await authService.registerUser(bodyValidated)

	return c.json({
		message: "user registered successfully",
		data: bodyValidated
	})
}
