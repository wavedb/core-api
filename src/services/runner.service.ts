import { prisma } from "@/helpers/prisma";

export class RunnerService {
	async createRunner(name: string, projectId: string) {
		return await prisma.run.create({
			data: {
				name: name,
				status: "running",
				project: {
					connect: {
						id: projectId
					}
				}
			}
		})
	}

	async getRunnerById(runnerId: string, projectId: string) {
		return await prisma.run.findFirst({
			where: {
				id: runnerId,
				projectId: projectId,
			}
		})
	}
}
