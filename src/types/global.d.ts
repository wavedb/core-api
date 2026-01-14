declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production" | "test";
			PORT?: string;
			DATABASE_URL?: string;
			[key: string]: string | undefined;
		}
	}
}

export {};
