/**
 * Application entry point
 * We only want to setup the business logic and attach the correct adapters
 */

import { initMemoryTodoAdapter } from "./adapter/todo-memory";
import { initHttpController } from "./controller/http";

const todoRepository = initMemoryTodoAdapter();
const httpController = initHttpController(todoRepository);

httpController.listen(3000, () => {
    console.log("[main] Server is running on port 3000");
});