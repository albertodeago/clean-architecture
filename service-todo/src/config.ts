import { z } from "zod";

const ConfigSchema = z.object({
	PORT: z.coerce.number().min(1).max(65535),
	// MONITORING_DNS: z.string().url().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export type ConfigEnv = {
	config: Config;
};

export const getConfig = (): Config => {
	const parsed = ConfigSchema.safeParse(process.env);
	if (!parsed.success) {
		console.error(
			"❌ Invalid environment variables:",
			z.prettifyError(parsed.error),
		);
		process.exit(1);
	}
	return parsed.data;
};
