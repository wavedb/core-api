import z from "zod";

export const metricScalar = z.float64("metric value must be a float number");
export const metricFile = z.file("metric image or audio must be a file object");

export const writeMetricValidationSchema = z.object({
	name: z.string().min(2, "name must be at least 2 characters long"),
	value: z.union([metricScalar, metricFile]),
	step: z.union([
		z.number().min(0, "step must be a non-negative integer"),
		z
			.string()
			.regex(/^\d+$/, "step string must represent a non-negative integer"),
	]),
	tag: z.string().max(100, "tag cannot exceed 100 characters").optional(),
	force: z
		.union([
			z.boolean(),
			z
				.string()
				.regex(/^(true|false)$/, "force string must be 'true' or 'false'"),
		])
		.optional(),
});

export const writeMetricSystemValidationSchema = z.object({
	data: z.array(writeMetricValidationSchema)
})

export const writeMetricImageValidationSchema = z.instanceof(File);

export const getMetricQueryValidationSchema = z.object({
	orderBy: z
		.enum(["step_asc", "step_desc", "time_asc", "time_desc"])
		.optional(),
	limit: z
		.number()
		.min(1, "limit must be at least 1")
		.max(5_000, "limit cannot exceed 5000")
		.optional(),
	offset: z.number().min(0, "offset must be a non-negative integer").optional(),
});

export type WriteMetricValidationType = z.infer<
	typeof writeMetricValidationSchema
>;
export type GetMetricQueryValidationType = z.infer<
	typeof getMetricQueryValidationSchema
>;

export const writeMetricValidation = async (data: unknown) => {
	return writeMetricValidationSchema.safeParseAsync(data);
};

export const writeMetricSystemValidation = async (data: unknown) => {
	return writeMetricSystemValidationSchema.safeParseAsync(data);
}

export const getMetricQueryValidation = async (data: unknown) => {
	return getMetricQueryValidationSchema.safeParseAsync(data);
};
