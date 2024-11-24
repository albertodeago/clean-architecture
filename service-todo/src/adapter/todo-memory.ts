import type { Todo, TodoId } from "../domain/todo";
import type { TodoRepository } from "../port/todo-repository";

// TODO: validation?

const initMemoryTodoAdapter = (): TodoRepository => {

    const todoList: Todo[] = [];

    return {
        listTodo: async () => {
            return todoList;
        },
        createTodo: async (todo: Todo) => {
            console.log("[adapter] Inserting todo", todo);

            todoList.push(todo);
            return todo;
        },
        updateTodo: async (id: TodoId, todo: Todo) => {
            const t = todoList.find((t) => t.id === id);
            if (!t) {
                // TODO: is error handling correct here?
                throw new Error("Todo not found");
            }

            t.title = todo.title;
            t.completed = todo.completed;
            return t;
        },
        deleteTodo: async (id: TodoId) => {
            const i = todoList.findIndex((t) => t.id === id);
            if (i === -1) {
                // TODO: is error handling correct here?
                throw new Error("Todo not found");
            }

            todoList.splice(i, 1);
        }
    }
}

export { initMemoryTodoAdapter }