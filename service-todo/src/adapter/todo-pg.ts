import type { Todo, TodoId } from "../domain/todo";
import type { TodoRepository } from "../port/todo-repository";

const initPgTodo = ({}): TodoRepository => {

    const todoList: Todo[] = [];

    return {
        listTodo: async () => {
            throw new Error("Not implemented");
        },
        createTodo: async (todo: Todo) => {
            throw new Error("Not implemented");
        },
        updateTodo: async (id: TodoId, todo: Todo) => {
            throw new Error("Not implemented");
        },
        deleteTodo: async (id: TodoId) => {
            throw new Error("Not implemented");
        }
    }
}

export { initPgTodo }