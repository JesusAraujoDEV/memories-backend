import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { env } from "./env";

function getSchemaFromDatabaseUrl(databaseUrl: string): string {
	try {
		const parsedUrl = new URL(databaseUrl);
		const schemaParam: string | null = parsedUrl.searchParams.get("schema");

		if (schemaParam && schemaParam.trim().length > 0) {
			return schemaParam.trim();
		}
	} catch {
		// Fallback to explicit default if URL parsing fails for any reason.
	}

	return "public";
}

const prismaAdapter = new PrismaPg({
	connectionString: env.databaseUrl,
}, {
	schema: getSchemaFromDatabaseUrl(env.databaseUrl),
});

export const prisma = new PrismaClient({
	adapter: prismaAdapter,
});
