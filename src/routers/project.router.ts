import { type Context, Hono } from "hono";
import { createProjectController, getProjectsController } from "@/controllers/project.controller";
import { authMiddleware } from "@/middlewares/auth";
import type { AuthVariables } from "@/types/variables";
import runnerRouter from "./runner.router";

const projectRouter = new Hono<{ Variables: AuthVariables }>()

projectRouter.use(authMiddleware)
projectRouter.use(async (c: Context, next: () => Promise<void>) => {
	const route = c.req.path
	const relativePath = route.replace(/^\/[^/]+\//, '/')
	if (relativePath === "/" && c.req.method === "GET") {
		await authMiddleware(c, next)
	} else {
		await next()
	}
})

projectRouter.get("/", getProjectsController)
projectRouter.post("/", createProjectController)
projectRouter.route("/:projectId/runner", runnerRouter)

export default projectRouter
