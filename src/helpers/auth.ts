import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { apiKey, bearer, jwt } from "better-auth/plugins"
import { prisma } from "./prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql"
	}),
	trustedOrigins: ["http://localhost:3000"],
	emailAndPassword: {
		enabled: true
	},
	rateLimit: {
		enabled: false
	},
	plugins: [
		bearer(),
		jwt(),
		apiKey({
			enableSessionForAPIKeys: true
		}),
	]
})

export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session | null;
}
