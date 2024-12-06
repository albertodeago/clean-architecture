import { describe, it, expect, beforeEach, vi } from "vitest";
import { initHttpAdapter } from "../../../src/infrastructure/http";
import type { TodoApplication } from "../../../src/application/todo";
import type { Config } from "../../../src/config";

const mockConfig = { port: 3000 } satisfies Config;
const mockTodoApplication = {
    listTodo: vi.fn(),
    createTodo: vi.fn(),
    toggleTodoCompleted: vi.fn(),
    updateTodoTitle: vi.fn(),
    deleteTodo: vi.fn(),
    archiveCompletedTodos: vi.fn(),
} satisfies TodoApplication;

// TODO: how do we test this?
// do we start a server with msw and check the routes?

describe.todo("HttpAdapter", () => {
    let httpAdapter: ReturnType<typeof initHttpAdapter>;

    beforeEach(() => {
        httpAdapter = initHttpAdapter({ todoApplication: mockTodoApplication, config: mockConfig });
    });

    it("creates a route to list todos", async () => {
        await httpAdapter.run();

        expect(mockTodoApplication.listTodo).toHaveBeenCalled();
    });

});
