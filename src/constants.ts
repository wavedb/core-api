import env from "env-var";

export const NODE_ENV = env
	.get("NODE_ENV")
	.default("development")
	.asEnum(["development", "production", "test"]);

export const DATABASE_URL = env.get("DATABASE_URL").required().asString();
export const JWT_SECRET = env.get("JWT_SECRET").required().asString();
export const JWT_EXPIRATION = env
	.get("JWT_EXPIRATION")
	.default("3600")
	.asIntPositive();

export const MINIO_ENDPOINT = env.get("MINIO_ENDPOINT").required().asString();
export const MINIO_PORT = env.get("MINIO_PORT").default("9000").asIntPositive();
export const MINIO_ACCESS_KEY = env
	.get("MINIO_ACCESS_KEY")
	.required()
	.asString();
export const MINIO_SECRET_KEY = env
	.get("MINIO_SECRET_KEY")
	.required()
	.asString();
export const MINIO_USE_SSL = env.get("MINIO_USE_SSL").default("false").asBool();
export const MINIO_BUCKET_NAME = env
	.get("MINIO_BUCKET_NAME")
	.default("wavedb-metrics")
	.asString();
