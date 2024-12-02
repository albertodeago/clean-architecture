
import type { DomainTodo, TodoRepository } from "../domain/todo";

/**
 * Application takes adapters as input and implements business logic (use cases)
 */


interface TodoApplication {
    createTodo: (todo: { id: string, title: string }) => Promise<DomainTodo>;
    listTodo: () => Promise<DomainTodo[]>;
    toggleTodoCompleted: (id: DomainTodo["id"]) => Promise<DomainTodo>;
    updateTodoTitle: (id: DomainTodo["id"], title: string) => Promise<DomainTodo>;
    deleteTodo: (id: DomainTodo["id"]) => Promise<DomainTodo>;
    archiveCompletedTodos: () => Promise<void>;
}

const initTodoApplication = ({ todoRepository }: { todoRepository: TodoRepository }): TodoApplication => {

    const repository = todoRepository;

    return {
        listTodo: async () => {
            console.log("[application][todo] listTodo");
            return await repository.listTodo();
        },
        createTodo: async (todo: { id: string, title: string }) => {
            console.log("[application][todo] createTodo", todo);
            return await repository.createTodo(todo);
        },
        toggleTodoCompleted: async (id: DomainTodo["id"]) => {
            // TODO: do we really need to get the todo first? check Readme, we should decide to do validation in one place, not half here
            // and half in the repository implementation
            const todo = await repository.getTodo(id);
            return await repository.updateTodo(id, { ...todo, isCompleted: !todo.isCompleted });
        },
        updateTodoTitle: async (id: DomainTodo["id"], title: string) => {
            const todo = await repository.getTodo(id);
            return await repository.updateTodo(id, { ...todo, title });
        },
        deleteTodo: async (id: DomainTodo["id"]) => {
            return await repository.deleteTodo(id);
        },

        archiveCompletedTodos: async () => {
            const todos = await repository.listTodo();
            const completedTodos = todos.filter((t) => t.isCompleted);
            for (const todo of completedTodos) {
                await repository.updateTodo(todo.id, { ...todo, isArchived: true });
            }
        }
    }
}

export { initTodoApplication, type TodoApplication }
