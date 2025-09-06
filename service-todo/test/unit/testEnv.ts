import { vi } from "vitest";
import type { TodoEnv } from "../../src/domain/todo";
import type { ConfigEnv } from "../../src/config";
import type { LoggerEnv } from "../../src/domain/logger";

export const makeTestEnv = () => {
	const mocks = {
		todoRepository: {
			listTodo: vi.fn<TodoEnv["todoRepository"]["listTodo"]>(),
			createTodo: vi.fn<TodoEnv["todoRepository"]["createTodo"]>(),
			updateTodo: vi.fn<TodoEnv["todoRepository"]["updateTodo"]>(),
			deleteTodo: vi.fn<TodoEnv["todoRepository"]["deleteTodo"]>(),
			getTodo: vi.fn<TodoEnv["todoRepository"]["getTodo"]>(),
		},
		config: {
			PORT: 3000,
		},
		logger: {
			info: vi.fn<LoggerEnv["logger"]["info"]>(),
			warn: vi.fn<LoggerEnv["logger"]["warn"]>(),
			error: vi.fn<LoggerEnv["logger"]["error"]>(),
			debug: vi.fn<LoggerEnv["logger"]["debug"]>(),
			log: vi.fn<LoggerEnv["logger"]["log"]>(),
		},
	};

	const env: TodoEnv & ConfigEnv & LoggerEnv = {
		todoRepository: mocks.todoRepository,
		config: mocks.config,
		logger: mocks.logger,
	};

	return { mocks, env };
};
