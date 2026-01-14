import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import ProjectService from "@/services/project.service";
import { RunnerService } from "@/services/runner.service";
import type { ProjectVariables, RunnerVariables } from "@/types/variables";

export const validProjectIdMiddleware = async (
	c: Context<{ Variables: ProjectVariables }>,
	next: () => Promise<void>,
) => {
	const projectId = c.req.param("projectId");
	if (typeof projectId !== "string" || projectId.length === 0) {
		throw new HTTPException(400, { message: "invalid projectId parameter" });
	}

	const userId = c.get("userId") as string;
	const projectService = new ProjectService();
	const project = await projectService.getProjectById(projectId, userId);
	if (!project) {
		throw new HTTPException(404, { message: "project not found" });
	}

	c.set("projectId", projectId);
	await next();
};

export const validRunnerIdMiddleware = async (
	c: Context<{ Variables: RunnerVariables }>,
	next: () => Promise<void>,
) => {
	const runnerId = c.req.param("runnerId");
	if (typeof runnerId !== "string" || runnerId.length === 0) {
		throw new HTTPException(400, { message: "invalid runnerId parameter" });
	}

	const projectId = c.get("projectId") as string;

	const runnerService = new RunnerService();
	const runner = await runnerService.getRunnerById(runnerId, projectId);
	if (!runner) {
		throw new HTTPException(404, { message: "runner not found" });
	}

	c.set("runnerId", runnerId);
	await next();
};
