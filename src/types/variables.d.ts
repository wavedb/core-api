import type { JwtVariables } from "hono/jwt";

export type AuthVariables = {
	userId: string;
} & JwtVariables

export type ProjectVariables = {
	projectId: string;
} & AuthVariables

export type RunnerVariables = {
	runnerId: string;
} & ProjectVariables
