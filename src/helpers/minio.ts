import { Client } from "minio";
import {
	MINIO_ACCESS_KEY,
	MINIO_BUCKET_NAME,
	MINIO_ENDPOINT,
	MINIO_PORT,
	MINIO_SECRET_KEY,
	MINIO_USE_SSL,
} from "@/constants";

export class MinIOHelper {
	readonly client: Client;

	constructor() {
		this.client = new Client({
			endPoint: MINIO_ENDPOINT,
			port: MINIO_PORT,
			useSSL: MINIO_USE_SSL,
			accessKey: MINIO_ACCESS_KEY,
			secretKey: MINIO_SECRET_KEY,
		});
	}

	public async init() {
		const isBucketExists = await this.client.bucketExists(MINIO_BUCKET_NAME);
		if (!isBucketExists) {
			await this.client.makeBucket(MINIO_BUCKET_NAME);
		}
	}

	async uploadFile(objectName: string, fileBuffer: Buffer) {
		return await this.client.putObject(
			MINIO_BUCKET_NAME,
			objectName,
			fileBuffer
		);
	}
}
