import type { Result } from "./result";

/**
 * Domain Entity
 */
export type Todo = {
	id: string;
	title: string;
	isCompleted?: boolean;
	isArchived?: boolean;
};

/**
 * Port / Interface for the Todo domain
 */
export type TodoEnv = {
	todoRepository: {
		listTodo: () => Promise<Result<Todo[]>>;
		createTodo: (todo: { title: string }) => Promise<Result<Todo>>;
		updateTodo: (id: Todo["id"], todo: Todo) => Promise<Result<Todo>>;
		deleteTodo: (id: Todo["id"]) => Promise<Result<Todo>>;
		getTodo: (id: Todo["id"]) => Promise<Result<Todo>>;
	};
};

/**
 * Domain Errors
 */
export const TodoNotFoundError = class extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = "TodoNotFoundError";
	}
};

/**
 * Use-cases
 *
 * They are stupid because at the moment the application is a "dumb" one and just do a
 * pass-through to the repository.
 * In a real-world app, the application would have more logic to handle business rules (and it would be here).
 */
export const listTodo =
	() =>
	(env: TodoEnv): Promise<Result<Todo[]>> => {
		return env.todoRepository.listTodo();
	};
export const createTodo =
	(partialTodo: { title: string }) =>
	(env: TodoEnv): Promise<Result<Todo>> => {
		return env.todoRepository.createTodo(partialTodo);
	};
export const updateTodo =
	(id: Todo["id"], updated: Todo) =>
	(env: TodoEnv): Promise<Result<Todo>> => {
		return env.todoRepository.updateTodo(id, updated);
	};
export const deleteTodo =
	(id: Todo["id"]) =>
	(env: TodoEnv): Promise<Result<Todo>> => {
		return env.todoRepository.deleteTodo(id);
	};
export const getTodo =
	(id: Todo["id"]) =>
	(env: TodoEnv): Promise<Result<Todo>> => {
		return env.todoRepository.getTodo(id);
	};

export const toggleTodo =
	(id: Todo["id"]) =>
	async (env: TodoEnv): Promise<Result<Todo>> => {
		const todoResult = await env.todoRepository.getTodo(id);
		if (!todoResult.success) {
			return todoResult;
		}

		const todo = todoResult.data;
		const updateResult = await env.todoRepository.updateTodo(id, {
			...todo,
			isCompleted: !todo.isCompleted,
		});
		return updateResult;
	};
