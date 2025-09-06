// import * as Sentry from "@sentry/node";
import * as R from "../../domain/result";
import { TodoNotFoundError, type Todo, type TodoEnv } from "../../domain/todo";
import type { LoggerEnv } from "@/domain/logger";

// Make function can receive dependencies (e.g. Logger)
export const makeTodoRepository = ({
	logger,
}: {
	logger: LoggerEnv["logger"];
}): TodoEnv["todoRepository"] => {
	logger.info("initMemoryTodoAdapter");
	const todoList: Todo[] = []; // in-memory list of todos

	return {
		listTodo: async () => {
			logger.info("listTodo");
			return R.success(todoList);
		},
		createTodo: async (todo: { title: string }) => {
			logger.info("createTodo", todo);
			const newTodo: Todo = {
				id: crypto.randomUUID(),
				title: todo.title,
				isCompleted: false,
				isArchived: false,
			};
			todoList.push(newTodo);
			return R.success(newTodo);
		},
		getTodo: async (id: Todo["id"]) => {
			logger.info("getTodo", id);
			const t = todoList.find((t) => t.id === id);

			if (!t) {
				return R.error(new TodoNotFoundError("Todo not found"));
			}
			logger.info("found in memory", t);
			return R.success(t);
		},
		updateTodo: async (id: Todo["id"], todo: Todo) => {
			logger.info("updateTodo", id, todo);
			const t = todoList.find((t) => t.id === id);
			if (!t) {
				return R.error(new TodoNotFoundError("Todo not found"));
			}

			t.title = todo.title;
			t.isCompleted = todo.isCompleted || false;
			t.isArchived = todo.isArchived || false;
			return R.success(t);
		},
		deleteTodo: async (id: Todo["id"]) => {
			logger.info("deleteTodo", id);
			const i = todoList.findIndex((t) => t.id === id);
			if (i === -1) {
				return R.error(new TodoNotFoundError("Todo not found"));
			}

			const [deleted] = todoList.splice(i, 1);
			if (!deleted) {
				return R.error(new TodoNotFoundError("Todo not found"));
			}
			return R.success(deleted);
		},
	};
};
