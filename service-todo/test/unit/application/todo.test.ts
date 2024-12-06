import { describe, it, expect, beforeEach, vi } from "vitest";
import { initTodoApplication, type TodoApplication } from "../../../src/application/todo";
import type { TodoRepository } from "../../../src/domain/todo";

const mockMemoryAdapter = {
    listTodo: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    getTodo: vi.fn(),
} satisfies TodoRepository;

describe("TodoApplication", () => {
    let todoApplication: TodoApplication;

    beforeEach(() => {
        todoApplication = initTodoApplication({ todoRepository: mockMemoryAdapter });
    });

    it("creates todos using the repository", async () => {
        await todoApplication.createTodo({ id: "1", title: "Test" });
        expect(mockMemoryAdapter.createTodo).toHaveBeenCalledWith({ id: "1", title: "Test" });
    });

    it("lists todos using the repository", async () => {
        await todoApplication.listTodo();
        expect(mockMemoryAdapter.listTodo).toHaveBeenCalled();
    });

    it("toggles a todo completed using the repository", async () => {
        vi.spyOn(mockMemoryAdapter, "getTodo").mockResolvedValue({ id: "1", title: "Test", isCompleted: false });

        await todoApplication.toggleTodoCompleted("1");
        expect(mockMemoryAdapter.updateTodo).toHaveBeenCalledWith("1", { id: "1", title: "Test", isCompleted: true });
    });

    it("updates a todo title using the repository", async () => {
        vi.spyOn(mockMemoryAdapter, "getTodo").mockResolvedValue({ id: "1", title: "Test", isCompleted: false });

        await todoApplication.updateTodoTitle("1", "New Title");
        expect(mockMemoryAdapter.updateTodo).toHaveBeenCalledWith("1", { id: "1", title: "New Title", isCompleted: false });
    });
});