import { ContentfulStatusCode } from "hono/utils/http-status"

export class BaseError extends Error {
	public readonly statusCode: ContentfulStatusCode;

	constructor(message: string, statusCode: ContentfulStatusCode) {
		super(message);
		this.name = "BaseError";
		this.statusCode = statusCode;
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
		};
	}
}

export class UserAlreadyExistsError extends BaseError {
	constructor(message: string = "user already exists", statusCode: ContentfulStatusCode = 400) {
		super(message, statusCode);
		this.name = "UserAlreadyExistsError";
	}
}

export class RegistrationError extends BaseError {
	constructor(message: string = "registration failed", statusCode: ContentfulStatusCode = 500) {
		super(message, statusCode);
		this.name = "RegistrationError";
	}
}

export class ValidationError extends BaseError {
	public readonly reasons: any;

	constructor(reasons: any, message: string = "validation error", statusCode: ContentfulStatusCode = 400) {
		super(message, statusCode);
		this.name = "ValidationError";
		this.reasons = reasons;
	}

	toJSON() {
		return {
			...super.toJSON(),
			reasons: this.reasons,
		}
	}
}
