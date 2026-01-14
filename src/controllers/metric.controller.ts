import type { Context } from "hono";
import { ValidationError } from "@/exceptions";
import { MetricService } from "@/services/metric.service";
import type { AuthVariables } from "@/types/variables";
import {
	getMetricQueryValidation,
	writeMetricValidation,
} from "@/validations/metric.validation";

export async function writeMetricController(
	c: Context<{ Variables: AuthVariables }>,
) {
	const body = await c.req.json();
	const bodyValidated = await writeMetricValidation(body);

	if (!bodyValidated.success) {
		throw new ValidationError(
			bodyValidated.error.issues,
			"validation failed",
			400,
		);
	}

	const runnerId = c.req.param("runnerId");
	const metricService = new MetricService();
	const data = await metricService.writeMetric(
		runnerId,
		bodyValidated.data.name,
		bodyValidated.data.value,
		bodyValidated.data.step,
		bodyValidated.data.tag,
		bodyValidated.data.force,
	);

	return c.json({
		message: "metric written successfully",
		data: data,
	});
}

export async function getMetricsController(
	c: Context<{ Variables: AuthVariables }>,
) {
	const { orderBy, limit, offset } = c.req.query();
	const queriesValidated = await getMetricQueryValidation({
		orderBy,
		limit: limit ? Number(limit) : undefined,
		offset: offset ? Number(offset) : undefined,
	});

	if (!queriesValidated.success) {
		throw new ValidationError(
			queriesValidated.error.issues,
			"validation failed",
			400,
		);
	}

	const runnerId = c.req.param("runnerId");

	const metricService = new MetricService();

	return c.json({
		message: "metrics fetched successfully",
		data: await metricService.getMetricsByRunnerId(
			runnerId,
			queriesValidated.data,
		),
	});
}
