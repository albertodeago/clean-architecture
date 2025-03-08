import type { DomainTodo, TodoRepository } from "../domain/todo";

const initPgTodo = (): TodoRepository => {

    // const todoList: DomainTodo[] = [];

    return {
        listTodo: async () => {
            throw new Error("Not implemented");
        },
        createTodo: async (todo: { id: string, title: string }) => {
            console.log("[adapter][todo-pg] createTodo", todo);
            throw new Error("Not implemented");
        },
        getTodo: async (id: DomainTodo["id"]) => {
            console.log("[adapter][todo-pg] getTodo", id);
            throw new Error("Not implemented");
        },
        updateTodo: async (id: DomainTodo["id"], todo: DomainTodo) => {
            console.log("[adapter][todo-pg] updateTodo", id, todo);
            throw new Error("Not implemented");
        },
        deleteTodo: async (id: DomainTodo["id"]) => {
            console.log("[adapter][todo-pg] deleteTodo", id);
            throw new Error("Not implemented");
        }
    }
}

export { initPgTodo }
