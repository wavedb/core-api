import { decode } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import { JWT_EXPIRATION } from "@/constants";
import { auth } from "./auth";

export async function generateJWT(userId: string): Promise<string> {
	const payload: JWTPayload = {
		sub: userId, // Subject (user ID)
		exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION, // Expiration time
		iat: Math.floor(Date.now() / 1000), // Issued at
		iss: "wavedb",
	};
	const signedToken = await auth.api.signJWT({
		body: {
			payload: payload,
		},
	});
	return signedToken.token;
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
	try {
		const verified = await auth.api.verifyJWT({
			body: {
				token: token,
			},
		});
		return verified.payload as JWTPayload;
	} catch {
		return null;
	}
}

export function decodeJWT(token: string): JWTPayload | null {
	try {
		const payload = decode(token);
		return payload as JWTPayload;
	} catch {
		return null;
	}
}
