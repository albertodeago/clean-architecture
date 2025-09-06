import { describe, it, expect } from "vitest";
import {
	listTodo,
	createTodo,
	updateTodo,
	deleteTodo,
	getTodo,
	toggleTodo,
} from "../../../src/domain/todo";
import { success, error } from "../../../src/domain/result";
import { makeTestEnv } from "../../unit/testEnv";

describe("[TODO DOMAIN]", () => {
	describe("listTodo", () => {
		it("returns todos when repository resolves successfully", async () => {
			const { env, mocks } = makeTestEnv();
			const mockTodos = [{ id: "1", title: "a" }];

			mocks.todoRepository.listTodo.mockImplementationOnce(async () =>
				success(mockTodos),
			);
			const result = await listTodo()(env);

			expect(result.success).toBe(true);
			if (result.success) expect(result.data).toEqual(mockTodos);
			expect(mocks.todoRepository.listTodo).toHaveBeenCalledOnce();
		});

		it("propagates repository errors", async () => {
			const { env, mocks } = makeTestEnv();
			const err = new Error("repo failure");
			mocks.todoRepository.listTodo.mockImplementationOnce(async () =>
				error(err),
			);
			const result = await listTodo()(env);

			expect(result.success).toBe(false);
			if (!result.success) expect(result.error).toBe(err);
			console.log(mocks.todoRepository.listTodo.mock.calls);
			expect(mocks.todoRepository.listTodo).toHaveBeenCalledOnce();
		});
	});

	describe("createTodo", () => {
		it("creates a todo and returns it", async () => {
			const { env, mocks } = makeTestEnv();
			const created = { id: "1", title: "new" };

			mocks.todoRepository.createTodo.mockImplementationOnce(async () =>
				success(created),
			);

			const result = await createTodo({ title: "new" })(env);

			expect(result.success).toBe(true);
			if (result.success) expect(result.data).toEqual(created);
			expect(mocks.todoRepository.createTodo).toHaveBeenCalledOnce();
		});

		it("propagates repository errors", async () => {
			const { env, mocks } = makeTestEnv();
			const err = new Error("create failed");
			mocks.todoRepository.createTodo.mockImplementationOnce(async () =>
				error(err),
			);

			const result = await createTodo({ title: "x" })(env);

			expect(result.success).toBe(false);
			if (!result.success) expect(result.error).toBe(err);
			expect(mocks.todoRepository.createTodo).toHaveBeenCalledOnce();
		});
	});

	describe("updateTodo", () => {
		it("updates a todo and returns it", async () => {
			const { env, mocks } = makeTestEnv();
			const updated = { id: "1", title: "updated" };
			mocks.todoRepository.updateTodo.mockImplementationOnce(async () =>
				success(updated),
			);

			const result = await updateTodo("1", updated)(env);

			expect(result.success).toBe(true);
			if (result.success) expect(result.data).toEqual(updated);
			expect(mocks.todoRepository.updateTodo).toHaveBeenCalledWith(
				"1",
				updated,
			);
		});

		it("propagates repository errors", async () => {
			const { env, mocks } = makeTestEnv();
			const err = new Error("update failed");
			mocks.todoRepository.updateTodo.mockImplementationOnce(async () =>
				error(err),
			);

			const result = await updateTodo("1", { id: "1", title: "x" })(env);

			expect(result.success).toBe(false);
			if (!result.success) expect(result.error).toBe(err);
			expect(mocks.todoRepository.updateTodo).toHaveBeenCalledOnce();
		});
	});

	describe("deleteTodo", () => {
		it("deletes a todo and returns it", async () => {
			const { env, mocks } = makeTestEnv();
			const deleted = { id: "1", title: "to-delete" };
			mocks.todoRepository.deleteTodo.mockImplementationOnce(async () =>
				success(deleted),
			);

			const result = await deleteTodo("1")(env);

			expect(result.success).toBe(true);
			if (result.success) expect(result.data).toEqual(deleted);
			expect(mocks.todoRepository.deleteTodo).toHaveBeenCalledWith("1");
		});

		it("propagates repository errors", async () => {
			const { env, mocks } = makeTestEnv();
			const err = new Error("delete failed");
			mocks.todoRepository.deleteTodo.mockImplementationOnce(async () =>
				error(err),
			);

			const result = await deleteTodo("1")(env);

			expect(result.success).toBe(false);
			if (!result.success) expect(result.error).toBe(err);
			expect(mocks.todoRepository.deleteTodo).toHaveBeenCalledOnce();
		});
	});

	describe("getTodo", () => {
		it("returns a todo when found", async () => {
			const { env, mocks } = makeTestEnv();
			const todo = { id: "1", title: "t" };
			mocks.todoRepository.getTodo.mockImplementationOnce(async () =>
				success(todo),
			);

			const result = await getTodo("1")(env);

			expect(result.success).toBe(true);
			if (result.success) expect(result.data).toEqual(todo);
			expect(mocks.todoRepository.getTodo).toHaveBeenCalledWith("1");
		});

		it("propagates repository errors", async () => {
			const { env, mocks } = makeTestEnv();
			const err = new Error("get failed");
			mocks.todoRepository.getTodo.mockImplementationOnce(async () =>
				error(err),
			);

			const result = await getTodo("1")(env);

			expect(result.success).toBe(false);
			if (!result.success) expect(result.error).toBe(err);
			expect(mocks.todoRepository.getTodo).toHaveBeenCalledOnce();
		});
	});

	describe("toggleTodo", () => {
		it("toggles completion and returns updated todo", async () => {
			const { env, mocks } = makeTestEnv();
			const todo = { id: "1", title: "t", isCompleted: false };
			const updated = { ...todo, isCompleted: true };

			mocks.todoRepository.getTodo.mockImplementationOnce(async () =>
				success(todo),
			);
			mocks.todoRepository.updateTodo.mockImplementationOnce(async () =>
				success(updated),
			);

			const result = await toggleTodo("1")(env);

			expect(result.success).toBe(true);
			if (result.success) expect(result.data).toEqual(updated);
			expect(mocks.todoRepository.getTodo).toHaveBeenCalledWith("1");
			expect(mocks.todoRepository.updateTodo).toHaveBeenCalledWith(
				"1",
				updated,
			);
		});

		it("propagates getTodo errors and does not call update", async () => {
			const { env, mocks } = makeTestEnv();
			const err = new Error("not found");
			mocks.todoRepository.getTodo.mockImplementationOnce(async () =>
				error(err),
			);

			const result = await toggleTodo("1")(env);

			expect(result.success).toBe(false);
			if (!result.success) expect(result.error).toBe(err);
			expect(mocks.todoRepository.updateTodo).not.toHaveBeenCalled();
		});
	});
});
