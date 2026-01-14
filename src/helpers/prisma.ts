import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "@/constants";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({
	connectionString: DATABASE_URL,
});

export const prisma = new PrismaClient({
	adapter: adapter,
});
