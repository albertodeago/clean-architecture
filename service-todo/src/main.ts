// we always need to import the instrumentation first
import "./instrument.js";

import { initHttpAdapter } from "./adapters/http";
import { initMemoryTodoAdapter } from "./adapters/todo-memory";
import { initTodoApplication } from "./application/todo";
import { getConfig } from "./config";
import { getLogger } from "./utils/logger";
/**
 * Main just create adapters, pass them to services
 */

const main = async () => {
    const config = getConfig();

    const logger = getLogger("main", config.logLevel);

    // create infrastructure / adapters
    const todoRepository = initMemoryTodoAdapter({ logger: logger.getChild("todoRepository") });

    // create application / use-cases
    const todoApplication = initTodoApplication({ todoRepository, logger: logger.getChild("todoApplication") });

    // create other infrastructure, the one that needs the app
    const httpAdapter = initHttpAdapter({ todoApplication, config, logger: logger.getChild("httpAdapter") });

    httpAdapter.run();
}

main();
