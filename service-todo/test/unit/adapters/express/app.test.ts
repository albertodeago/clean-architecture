import { describe, it, expect } from "vitest";
import { makeHttpApplication } from "../../../../src/adapters/express/app";
import { makeTestEnv } from "../../testEnv";
import { success } from "../../../../src/domain/result";
import request from "supertest";

describe("express app adapter", () => {
	it("routes to domain handlers and returns expected responses", async () => {
		const { env, mocks } = makeTestEnv();
		// use a non-default port to avoid collisions in CI
		env.config.PORT = 3001;

		const app = makeHttpApplication({ env });
		app.start();
		// give server a moment to start
		await new Promise((r) => setTimeout(r, 50));

		try {
			// GET /todos -> empty
			mocks.todoRepository.listTodo.mockResolvedValueOnce(success([]));
			const getRes = await request(`http://127.0.0.1:${env.config.PORT}`).get(
				"/todos",
			);
			expect(getRes.status).toBe(200);
			expect(getRes.body).toEqual([]);

			// POST /todos -> created
			const created = { id: "1", title: "x" };
			mocks.todoRepository.createTodo.mockResolvedValueOnce(success(created));
			const postRes = await request(`http://127.0.0.1:${env.config.PORT}`)
				.post("/todos")
				.send({ title: "x" });
			expect(postRes.status).toBe(201);
			expect(postRes.body).toEqual(created);

			// PUT /todos/:id -> update
			const updated = {
				id: "1",
				title: "updated",
				isCompleted: false,
				isArchived: false,
			};
			mocks.todoRepository.updateTodo.mockResolvedValueOnce(success(updated));
			const putRes = await request(`http://127.0.0.1:${env.config.PORT}`)
				.put("/todos/1")
				.send({ title: "updated" });
			expect(putRes.status).toBe(201);
			expect(putRes.body).toEqual(updated);

			// PUT toggle -> 200 (toggle handler uses getTodo + updateTodo)
			const toggled = { id: "1", title: "updated", isCompleted: true };
			mocks.todoRepository.getTodo.mockResolvedValueOnce(
				success({ id: "1", title: "updated", isCompleted: false }),
			);
			mocks.todoRepository.updateTodo.mockResolvedValueOnce(success(toggled));
			const toggleRes = await request(
				`http://127.0.0.1:${env.config.PORT}`,
			).put("/todos/1/toggle");
			expect(toggleRes.status).toBe(200);
			expect(toggleRes.body).toEqual(toggled);

			// DELETE -> 204
			mocks.todoRepository.deleteTodo.mockResolvedValueOnce(
				success({ id: "1", title: "updated" }),
			);
			const delRes = await request(
				`http://127.0.0.1:${env.config.PORT}`,
			).delete("/todos/1");
			expect(delRes.status).toBe(204);
		} finally {
			app.stop();
			// small delay to ensure port freed
			await new Promise((r) => setTimeout(r, 20));
		}
	});
});
