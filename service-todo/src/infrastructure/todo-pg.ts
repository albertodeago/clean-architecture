import type { DomainTodo, TodoRepository } from "../domain/todo";

const initPgTodo = ({}): TodoRepository => {

    const todoList: DomainTodo[] = [];

    return {
        listTodo: async () => {
            throw new Error("Not implemented");
        },
        createTodo: async (todo: { id: string, title: string }) => {
            throw new Error("Not implemented");
        },
        getTodo: async (id: DomainTodo["id"]) => {
            throw new Error("Not implemented");
        },
        updateTodo: async (id: DomainTodo["id"], todo: DomainTodo) => {
            throw new Error("Not implemented");
        },
        deleteTodo: async (id: DomainTodo["id"]) => {
            throw new Error("Not implemented");
        }
    }
}

export { initPgTodo }