import z from "zod";

export const userApiKeyValidationSchema = z.object({
	name: z.string().min(2, "name must be at least 2 characters long")
})

export type UserApiKeyValidationType = z.infer<typeof userApiKeyValidationSchema>;

export const userApiKeyValidation = async (data: unknown) => {
	return userApiKeyValidationSchema.safeParseAsync(data)
}
