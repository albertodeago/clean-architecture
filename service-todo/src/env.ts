import { makeLogger } from "./adapters/console/logger";
import { makeTodoRepository } from "./adapters/memory/todo";

import type { LoggerEnv } from "./domain/logger";
import type { TodoEnv } from "./domain/todo";
import { type ConfigEnv, getConfig } from "./config";

/**
 * we return the concatenation of all the Envs needed by the application
 */
export const makeEnv = (): TodoEnv & LoggerEnv & ConfigEnv => {
	const logger = makeLogger();
	const config = getConfig();

	return {
		todoRepository: makeTodoRepository({ logger }),
		logger,
		config,
	};
};
