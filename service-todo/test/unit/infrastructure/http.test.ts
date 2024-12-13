import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { initHttpAdapter } from "../../../src/infrastructure/http";
import { TodoNotFoundError } from "../../../src/domain/errors";

import type { TodoApplication } from "../../../src/application/todo";
import type { Config } from "../../../src/config";
import { getLogger } from "../../../src/utils/logger";

const logger = getLogger("test", "error");

const mockConfig = { port: 3001, logLevel: "error" } satisfies Config;
const mockTodoApplication = {
    listTodo: vi.fn(),
    createTodo: vi.fn(),
    toggleTodoCompleted: vi.fn(),
    updateTodoTitle: vi.fn(),
    deleteTodo: vi.fn(),
    archiveCompletedTodos: vi.fn(),
} satisfies TodoApplication;

const baseUrl = `http://localhost:${mockConfig.port}`;

describe("HttpAdapter", () => {
    let httpAdapter: ReturnType<typeof initHttpAdapter>;

    beforeEach(async() => {
        httpAdapter = initHttpAdapter({ 
            todoApplication: mockTodoApplication, 
            config: mockConfig, 
            logger 
        });
        await httpAdapter.run();
    });

    afterEach(() => {
        httpAdapter.stop();
    });

    it("creates a route to list todos", async () => {
        const response = await fetch(`${baseUrl}/todos`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        expect(response.ok).toBe(true);
        expect(mockTodoApplication.listTodo).toHaveBeenCalledOnce();
    });

    it("creates a route to create a todo", async () => {
        const response = await fetch(`${baseUrl}/todos`, {
            method: "POST",
            body: JSON.stringify({ title: "Test" }),
        });
        expect(response.ok).toBe(true);
        expect(mockTodoApplication.createTodo).toHaveBeenCalledOnce();
    });

    it("creates a route to toggle a todo", async () => {
        const response = await fetch(`${baseUrl}/todos/1/toggle`, {
            method: "PUT",
        });
        expect(response.ok).toBe(true);
        expect(mockTodoApplication.toggleTodoCompleted).toHaveBeenCalledOnce();
    });

    it("returns a 404 if the todo to toggle is not found", async () => {
        mockTodoApplication.toggleTodoCompleted.mockRejectedValueOnce(new TodoNotFoundError("Todo not found"));
        const response = await fetch(`${baseUrl}/todos/1/toggle`, {
            method: "PUT",
        });
        expect(response.status).toBe(404);
        expect(response.statusText).toEqual("Not Found");
    });

    it("returns a 500 if the todo to toggle encounters an error", async () => {
        mockTodoApplication.toggleTodoCompleted.mockRejectedValueOnce(new Error("Internal server error"));
        const response = await fetch(`${baseUrl}/todos/1/toggle`, {
            method: "PUT",
        });
        expect(response.status).toBe(500);
        expect(response.statusText).toEqual("Internal Server Error");
    });

    it("creates a route to update a todo", async () => {
        const response = await fetch(`${baseUrl}/todos/1`, {
            method: "PUT",
        });
        expect(response.ok).toBe(true);
        expect(mockTodoApplication.updateTodoTitle).toHaveBeenCalledOnce();
    });

    it("returns a 404 if the todo to update is not found", async () => {
        mockTodoApplication.updateTodoTitle.mockRejectedValueOnce(new TodoNotFoundError("Todo not found"));
        const response = await fetch(`${baseUrl}/todos/1`, {
            method: "PUT",
        });
        expect(response.status).toBe(404);
        expect(response.statusText).toEqual("Not Found");
    });

    it("returns a 500 if the todo to update encounters an error", async () => {
        mockTodoApplication.updateTodoTitle.mockRejectedValueOnce(new Error("Internal server error"));
        const response = await fetch(`${baseUrl}/todos/1`, {
            method: "PUT",
        });
        expect(response.status).toBe(500);
        expect(response.statusText).toEqual("Internal Server Error");
    });

    it("creates a route to delete a todo", async () => {
        const response = await fetch(`${baseUrl}/todos/1`, {
            method: "DELETE",
        });
        expect(response.ok).toBe(true);
        expect(mockTodoApplication.deleteTodo).toHaveBeenCalledOnce();
    }); 

    it("returns a 404 if the todo to delete is not found", async () => {
        mockTodoApplication.deleteTodo.mockRejectedValueOnce(new TodoNotFoundError("Todo not found"));
        const response = await fetch(`${baseUrl}/todos/1`, {
            method: "DELETE",
        });
        expect(response.status).toBe(404);
        expect(response.statusText).toEqual("Not Found");
    });

    it("returns a 500 if the todo to delete encounters an error", async () => {
        mockTodoApplication.deleteTodo.mockRejectedValueOnce(new Error("Internal server error"));
        const response = await fetch(`${baseUrl}/todos/1`, {
            method: "DELETE",
        });
        expect(response.status).toBe(500);
        expect(response.statusText).toEqual("Internal Server Error");
    });
});
