import z from "zod";
import { RunnerStatus } from "@/generated/prisma/enums";

export const createRunnerValidationSchema = z.object({
	name: z.string().min(3, "runner name must be at least 3 characters long"),
	config: z.json().optional(),
});
export const markRunnerAsValidationSchema = z.object({
	status: z.enum([RunnerStatus.COMPLETED, RunnerStatus.FAILED, RunnerStatus.CANCELED]),
});

export type CreateRunnerValidationType = z.infer<
	typeof createRunnerValidationSchema
>;
export type MarkRunnerAsValidationType = z.infer<
	typeof markRunnerAsValidationSchema
>;

export const createRunnerValidation = async (data: unknown) => {
	return createRunnerValidationSchema.safeParseAsync(data);
};

export const markRunnerAsValidation = async (data: unknown) => {
	return markRunnerAsValidationSchema.safeParseAsync(data);
}
