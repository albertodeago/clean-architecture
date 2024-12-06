import { initHttpAdapter } from "./infrastructure/http";
import { initMemoryTodoAdapter } from "./infrastructure/todo-memory";
import { initTodoApplication } from "./application/todo";
import { getConfig } from "./config";

/**
 * Main just create adapters, pass them to services
 */

const main = async () => {
    const config = getConfig();

    // create infrastructure / adapters
    const todoRepository = initMemoryTodoAdapter();
    
    // create application / use-cases
    const todoApplication = initTodoApplication({ todoRepository });
    
    // create other infrastructure, the one that needs the application
    const httpAdapter = initHttpAdapter({ todoApplication });

    httpAdapter.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
}

main();