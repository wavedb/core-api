import type { Context } from "hono";
import { ValidationError } from "@/exceptions";
import { RunnerService } from "@/services/runner.service";
import type { RunnerVariables } from "@/types/variables";
import { createRunnerValidation } from "@/validations/runner.validation";

export async function createRunnerController(
	c: Context<{ Variables: RunnerVariables }>,
) {
	const body = await c.req.json();
	const bodyValidated = await createRunnerValidation(body);

	if (!bodyValidated.success) {
		throw new ValidationError(
			bodyValidated.error.issues,
			"validation failed",
			400,
		);
	}

	const projectId = c.get("projectId") as string;

	const runnerService = new RunnerService();
	console.log(bodyValidated.data.config);
	const data = await runnerService.createRunner(
		bodyValidated.data.name,
		projectId,
		JSON.stringify(bodyValidated.data.config),
	);

	return c.json(
		{
			message: "runner created successfully",
			data: {
				id: data.id,
				name: data.name,
				status: data.status,
				projectId: data.projectId,
				config: data.config,
			},
		},
		201,
	);
}

export async function getRunnerController(
	c: Context<{ Variables: RunnerVariables }>,
) {
	const projectId = c.get("projectId") as string;
	const runnerId = c.req.param("runnerId");

	const runnerService = new RunnerService();
	const data = await runnerService.getRunnerById(runnerId, projectId);

	return c.json(
		{
			message: "runner fetched successfully",
			data: data
				? {
						id: data.id,
						name: data.name,
						status: data.status,
						projectId: data.projectId,
						config: data.config,
					}
				: null,
		},
		200,
	);
}
