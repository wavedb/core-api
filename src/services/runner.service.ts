import { RunnerStatus } from "@/generated/prisma/enums";
import { prisma } from "@/helpers/prisma";

export class RunnerService {
	async createRunner(name: string, projectId: string, config: string) {
		return await prisma.run.create({
			data: {
				name: name,
				status: RunnerStatus.PENDING,
				config: JSON.parse(config),
				project: {
					connect: {
						id: projectId,
					},
				},
			},
		});
	}

	async markRunnerAs(runnerId: string, runnerStatus: RunnerStatus) {
		return await prisma.run.update({
			where: {
				id: runnerId,
			},
			data: {
				status: runnerStatus,
			},
		});
	}

	async getRunnerById(runnerId: string, projectId: string) {
		return await prisma.run.findFirst({
			where: {
				id: runnerId,
				projectId: projectId,
			},
		});
	}
}
