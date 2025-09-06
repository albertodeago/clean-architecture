import type { Todo, TodoEnv } from "@/domain/todo";

/**
 * This is just a example, here we should use PG and implement the repository
 */
export const makeTodoRepository = (): TodoEnv["todoRepository"] => {
	return {
		listTodo: async () => {
			throw new Error("Not implemented");
		},
		createTodo: async (todo: { title: string }) => {
			console.log("[adapter][todo-pg] createTodo", todo);
			throw new Error("Not implemented");
		},
		getTodo: async (id: Todo["id"]) => {
			console.log("[adapter][todo-pg] getTodo", id);
			throw new Error("Not implemented");
		},
		updateTodo: async (id: Todo["id"], todo: Todo) => {
			console.log("[adapter][todo-pg] updateTodo", id, todo);
			throw new Error("Not implemented");
		},
		deleteTodo: async (id: Todo["id"]) => {
			console.log("[adapter][todo-pg] deleteTodo", id);
			throw new Error("Not implemented");
		},
	};
};
