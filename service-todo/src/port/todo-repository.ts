import type { Todo, TodoId } from "../domain/todo";

interface TodoRepository {
    listTodo: () => Promise<Todo[]>;
    createTodo: (todo: Todo) => Promise<Todo>;
    updateTodo: (id: TodoId, todo: Todo) => Promise<Todo>;
    deleteTodo: (id: TodoId) => Promise<void>;
}

export { TodoRepository }