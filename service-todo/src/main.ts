import { initHttpAdapter } from "./infrastructure/http";
import { initMemoryTodoAdapter } from "./infrastructure/todo-memory";
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
    
    // create other infrastructure, the one that needs the application
    const httpAdapter = initHttpAdapter({ todoApplication, config, logger: logger.getChild("httpAdapter") });

    httpAdapter.run();
}

main();