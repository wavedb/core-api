import z from "zod";

export const createProjectValidationSchema = z.object({
	name: z.string().min(3, "project name must be at least 3 characters long"),
	description: z
		.string()
		.max(500, "description cannot exceed 500 characters")
		.optional(),
});

export type CreateProjectValidationType = z.infer<
	typeof createProjectValidationSchema
>;

export const createProjectValidation = async (data: unknown) => {
	return createProjectValidationSchema.safeParseAsync(data);
};
