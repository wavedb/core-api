import z from "zod";

export const createRunnerValidationSchema = z.object({
	name: z.string().min(3, "runner name must be at least 3 characters long")
})

export type CreateRunnerValidationType = z.infer<typeof createRunnerValidationSchema>

export const createRunnerValidation = async (data: unknown) => {
	return createRunnerValidationSchema.safeParseAsync(data)
}
