import z from "zod";

// Validation schema for user registration
export const registerValidationSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters long"),
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Validation schema for user login
export const loginValidationSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Type for registered user data
export type RegisterValidationType = z.infer<typeof registerValidationSchema>;

// Type for logged-in user data
export type LoginValidationType = z.infer<typeof loginValidationSchema>;

// Function to validate registration data
export const registerValidation = async (data: unknown) => {
	return registerValidationSchema.safeParseAsync(data);
};

// Function to validate login data
export const loginValidation = async (data: unknown) => {
	return loginValidationSchema.safeParseAsync(data);
};
