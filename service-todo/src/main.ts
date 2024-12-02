
/**
 * TODO:
 * - where do we create and handle http?
 * - add eslint plugin to avoid importing stuff from wrong directories (to avoid creating dependencies)
 * 
 * - would it be easier with Zod?
 */

import { initHttpAdapter } from "./infrastructure/http";
import { initMemoryTodoAdapter } from "./infrastructure/todo-memory";
import { initTodoApplication } from "./application/todo";

/**
 * Application use cases:
 * - create a Todo (title, isCompleted)
 * - list all Todos
 * - mark a Todo as completed / uncompleted
 * - change a Todo title
 * - delete a Todo
 * - archive completed Todos
 */


// TODO: this should be in a config file
const PORT = 3000;

/**
 * Main just create adapters, pass them to services
 */

const main = async () => {
    // create infrastructure / adapters
    const todoRepository = initMemoryTodoAdapter();
    
    // create application / use-cases
    const todoApplication = initTodoApplication({ todoRepository });
    
    // create other infrastructure, the one that needs the application
    const httpAdapter = initHttpAdapter({ todoApplication });

    httpAdapter.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

main();