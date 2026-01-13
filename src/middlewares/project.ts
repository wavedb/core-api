import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import ProjectService from "@/services/project.service";
import type { ProjectVariables } from "@/types/variables";

export const validProjectIdMiddleware = async (c: Context<{ Variables: ProjectVariables }>, next: () => Promise<void>) => {
	const projectId = c.req.param("projectId")
	if (typeof projectId !== "string" || projectId.length === 0) {
		throw new HTTPException(400, { message: "invalid projectId parameter" })
	}

	const userId = c.get("userId") as string
	const projectService = new ProjectService()
	const project = await projectService.getProjectById(projectId, userId)
	if (!project) {
		throw new HTTPException(404, { message: "project not found" })
	}

	c.set("projectId", projectId)
	await next()
}
