import type { Context } from "hono";
import { ValidationError } from "@/exceptions";
import { MinIOHelper } from "@/helpers/minio";
import { MetricService } from "@/services/metric.service";
import type { AuthVariables } from "@/types/variables";
import {
	getMetricQueryValidation,
	writeMetricValidation,
} from "@/validations/metric.validation";

export async function writeMetricScalarController(
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

	if (bodyValidated.data.value === undefined) {
		throw new ValidationError([], "value is required for scalar metric", 400);
	}

	const runnerId = c.req.param("runnerId");
	const metricService = new MetricService();
	const data = await metricService.writeMetric(
		runnerId,
		bodyValidated.data.name,
		bodyValidated.data.value.toString(),
		bodyValidated.data.step ? Number(bodyValidated.data.step) : 0,
		bodyValidated.data.tag,
		bodyValidated.data.force ? bodyValidated.data.force === "true" : false,
	);

	return c.json({
		message: "metric written successfully",
		data: data,
	});
}

export async function writeMetricImageController(
	c: Context<{ Variables: AuthVariables }>,
) {
	const body = await c.req.parseBody();
	const bodyValidated = await writeMetricValidation(body);

	if (!bodyValidated.success) {
		throw new ValidationError(
			bodyValidated.error.issues,
			"validation failed",
			400,
		);
	}

	const minioHelper = new MinIOHelper();
	await minioHelper.init();
	const imageFile = bodyValidated.data.value;
	const runnerId = c.req.param("runnerId");
	const projectId = c.req.param("projectId");
	const objectName = `${projectId}/${runnerId}/step_${bodyValidated.data.step}/${bodyValidated.data.name}.png`;

	if (imageFile instanceof File) {
		if (imageFile.type !== "image/png" && imageFile.type !== "image/jpeg") {
			throw new ValidationError(
				[],
				"only png and jpeg images are supported",
				400,
			);
		}

		const imageBuffer = await imageFile.arrayBuffer();
		await minioHelper.uploadImage(objectName, Buffer.from(imageBuffer));

		const metricService = new MetricService();
		const data = await metricService.writeMetric(
			runnerId,
			bodyValidated.data.name,
			objectName,
			bodyValidated.data.step ? Number(bodyValidated.data.step) : 0,
			bodyValidated.data.tag
				? `${bodyValidated.data.tag};image_url=${objectName}`
				: `image_url=${objectName}`,
			bodyValidated.data.force ? bodyValidated.data.force === "true" : false,
		);
		return c.json({
			message: "metric written successfully",
			data: data,
		});
	} else {
		throw new ValidationError([], "image file is required", 400);
	}
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
