import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { auth } from "@/helpers/auth";
import { UserService } from "@/services/user.service";

export const authMiddleware = async (c: Context, next: () => Promise<void>) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});
	if (!session || !session.user) {
		throw new HTTPException(401, { message: "unauthorized" });
	}
	c.set("userId", session.user.id);

	await next();
};

export const apiKeyMiddleware = async (
	c: Context,
	next: () => Promise<void>,
) => {
	const apiKey = c.req.header("X-Api-Key");
	if (typeof apiKey !== "string") {
		throw new HTTPException(401, {
			message: "api key is required in X-Api-Key header",
		});
	}

	const userService = new UserService();
	const user = await userService.getUserByApiKey(c.req.raw.headers);
	if (!user) {
		throw new HTTPException(401, { message: "invalid api key" });
	}
	c.set("userId", user.user.id);

	await next();
};
