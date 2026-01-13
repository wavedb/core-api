import { prisma } from "@/helpers/prisma";

export default class ProjectService {
	async createProject(
		userId: string,
		name: string,
		description?: string
	) {
		return await prisma.project.create({
			data: {
				name: name,
				description: description,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async getProjectsByUserId(userId: string) {
		return await prisma.project.findMany({
			where: {
				userId: userId
			}
		})
	}

	async getProjectById(projectId: string, userId: string) {
		return await prisma.project.findUnique({
			where: {
				id: projectId,
				user: {
					id: userId
				}
			}
		})
	}
}
