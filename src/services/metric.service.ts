import { MetricWriteError } from "@/exceptions";
import { prisma } from "@/helpers/prisma";
import type { GetMetricQueryValidationType } from "@/validations/metric.validation";

export class MetricService {
	async getMetricsByRunnerId(
		runnerId: string,
		params: GetMetricQueryValidationType,
	) {
		const { orderBy, limit, offset } = params;

		return await prisma.runnerMetric.findMany({
			where: {
				run: {
					id: runnerId,
				},
			},
			orderBy: {
				step: orderBy?.startsWith("step_")
					? orderBy.endsWith("_asc")
						? "asc"
						: "desc"
					: undefined,
				createdAt: orderBy?.startsWith("time_")
					? orderBy.endsWith("_asc")
						? "asc"
						: "desc"
					: undefined,
			},
			take: limit,
			skip: offset,
		});
	}

	async getMetricByStep(runnerId: string, step: number) {
		return await prisma.runnerMetric.findFirst({
			where: {
				runId: runnerId,
				step: step,
			},
		});
	}

	async writeMetric(
		runnerId: string,
		name: string,
		value: string,
		step: number,
		tag?: string,
		force?: boolean,
	) {
		const isExistingStep = await this.getMetricByStep(runnerId, step);
		console.log(isExistingStep);
		if (isExistingStep) {
			if (!force) {
				throw new MetricWriteError(
					`metric for step ${step} already exists`,
					409,
				);
			}
			return await prisma.runnerMetric.update({
				where: {
					id: isExistingStep.id,
				},
				data: {
					name: name,
					value: value,
					tag: tag,
				},
			});
		}

		return await prisma.runnerMetric.create({
			data: {
				name: name,
				value: value,
				step: step,
				tag: tag,

				run: {
					connect: {
						id: runnerId,
					},
				},
			},
		});
	}
}
