import type { Context } from "hono";
import { ValidationError } from "@/exceptions";
import { RunnerService } from "@/services/runner.service";
import type { ProjectVariables } from "@/types/variables";
import { createRunnerValidation } from "@/validations/runner.validation";

export async function createRunnerController(c: Context<{ Variables: ProjectVariables }>) {
	const body = await c.req.json()
	const bodyValidated = await createRunnerValidation(body)

	if (!bodyValidated.success) {
		throw new ValidationError(bodyValidated.error.issues, "validation failed", 400)
	}

	const projectId = c.get("projectId") as string

	const runnerService = new RunnerService()
	const data = await runnerService.createRunner(
		bodyValidated.data.name,
		projectId
	)

	return c.json({
		message: "runner created successfully",
		data: {
			id: data.id,
			name: data.name,
			status: data.status,
			projectId: data.projectId
		}
	}, 201)
}
