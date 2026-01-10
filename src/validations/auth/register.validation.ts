import z from "zod";

export const registerValidationSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters long"),
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
})

export type RegisterValidationType = z.infer<typeof registerValidationSchema>;

export const registerValidation = async (data: unknown) => {
	return registerValidationSchema.parseAsync(data)
}
