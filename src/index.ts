import { APIError } from "better-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { NODE_ENV } from "./constants";
import { BaseError } from "./exceptions";
import authRouter from "./routers/auth.router";
import projectRouter from "./routers/project.router";
import userRouter from "./routers/user.router";

const app = new Hono();

app.use(
	"/auth/*",
	cors({
		origin: "http://localhost:3001", // replace with your origin
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);
app.use(logger());
app.route("/auth", authRouter);
app.route("/user", userRouter);
app.route("/project", projectRouter);

app.get("/", (c) => {
	return c.text("WaveDB Health!");
});

app.notFound((c) => {
	return c.json({ message: "route not found" }, 404);
});

app.onError((err, c) => {
	if (err instanceof BaseError) {
		return c.json(err.toJSON(), err.statusCode);
	}

	if (err instanceof HTTPException) {
		return c.json({ message: err.message }, err.status);
	}

	if (err instanceof APIError) {
		return c.json(
			{ message: err.message },
			err.statusCode as ContentfulStatusCode,
		);
	}
	if (NODE_ENV === "development") {
		console.error(err)
		return c.json(
			{ message: "Internal Server Error", stack: err.stack },
			500,
		);
	} else {
		return c.json({ message: "Internal Server Error" }, 500);
	}
});
export default app;
