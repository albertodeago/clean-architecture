import { describe, it, expect, beforeEach } from "vitest";
import { initMemoryTodoAdapter } from "../../../src/infrastructure/todo-memory";
import { TodoRepository } from "../../../src/domain/todo";
import { TodoNotFoundError } from "../../../src/domain/errors";
import { getLogger } from "../../../src/utils/logger";

const logger = getLogger("test", "error");

describe("TodoMemoryAdapter", () => {
    let todoAdapter: TodoRepository;

    beforeEach(() => {
        todoAdapter = initMemoryTodoAdapter({ logger});
    });

    it("should create a todo", async () => {
        const todo = await todoAdapter.createTodo({ id: "1", title: "Test" });
        expect(todo.id).toBe("1");
        expect(todo.title).toBe("Test");
    });

    it("should get a todo", async () => {
        await todoAdapter.createTodo({ id: "1", title: "Test" });
        const todo = await todoAdapter.getTodo("1");
        expect(todo.id).toBe("1");
        expect(todo.title).toBe("Test");
    });

    it ("should throw an error if the todo is not found", async () => {
        await expect(todoAdapter.getTodo("1")).rejects.toThrow(TodoNotFoundError);
    });

    
});