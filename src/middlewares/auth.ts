import type { Context } from "hono";
import { every, some } from "hono/combine";
import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";
import { JWT_SECRET } from "@/constants";
import { UserService } from "@/services/user.service";

export const authJwtMiddleware = async (c: Context, next: () => Promise<void>) => {
	const jwtMiddleware = jwt({
		secret: JWT_SECRET,
		headerName: "Authorization",
		alg: "HS256",
		verification: {
			iss: "wavedb",
			iat: true,
			exp: true
		}
	})
	return jwtMiddleware(c, next)
}

export const authJwtUserMiddleware = async (c: Context, next: () => Promise<void>) => {
	const jwtPayload = c.get("jwtPayload")
	if (!jwtPayload || typeof jwtPayload.sub !== "string") {
		return c.json(
			{
				message: "unauthorized"
			},
			401
		)
	}
	c.set("userId", jwtPayload.sub)
	await next()
}

export const authMiddleware = some(every(authJwtMiddleware, authJwtUserMiddleware));

export const apiKeyMiddleware = async (c: Context, next: () => Promise<void>) => {
	const apiKey = c.req.header("X-Api-Key")
	if (typeof apiKey !== "string") {
		throw new HTTPException(401, { message: "api key is required in X-Api-Key header" })
	}

	const userService = new UserService()
	const user = await userService.getUserByApiKey(apiKey)
	if (!user) {
		throw new HTTPException(401, { message: "invalid api key" })
	}

	c.set("userId", user.id)

	await next()
}
