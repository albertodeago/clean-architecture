import { describe, it, expect } from "vitest";
import { makeTodoRepository } from "../../../../src/adapters/memory/todo";
import { makeTestEnv } from "../../testEnv";

describe("memory todo adapter", () => {
	it("lists, creates, gets, updates and deletes todos", async () => {
		const { env } = makeTestEnv();
		const repo = makeTodoRepository({ logger: env.logger });

		// start empty
		const list0 = await repo.listTodo();
		expect(list0.success).toBe(true);
		if (list0.success) expect(list0.data).toEqual([]);

		// create
		const createdRes = await repo.createTodo({ title: "t1" });
		expect(createdRes.success).toBe(true);
		if (!createdRes.success) throw new Error("create failed in test");
		const created = createdRes.data;

		// list has one
		const list1 = await repo.listTodo();
		expect(list1.success).toBe(true);
		if (list1.success) expect(list1.data.length).toBe(1);

		// get
		const getRes = await repo.getTodo(created.id);
		expect(getRes.success).toBe(true);
		if (getRes.success) expect(getRes.data.id).toBe(created.id);

		// update
		const updatedRes = await repo.updateTodo(created.id, {
			...created,
			title: "updated",
		});
		expect(updatedRes.success).toBe(true);
		if (updatedRes.success) expect(updatedRes.data.title).toBe("updated");

		// delete
		const delRes = await repo.deleteTodo(created.id);
		expect(delRes.success).toBe(true);
		if (delRes.success) expect(delRes.data.id).toBe(created.id);

		// get should now fail
		const getAfter = await repo.getTodo(created.id);
		expect(getAfter.success).toBe(false);
	});

	it("returns not found errors for missing ids", async () => {
		const { env } = makeTestEnv();
		const repo = makeTodoRepository({ logger: env.logger });

		const missing = await repo.getTodo("not-exist");
		expect(missing.success).toBe(false);

		const upd = await repo.updateTodo("not-exist", {
			id: "not-exist",
			title: "x",
		});
		expect(upd.success).toBe(false);

		const del = await repo.deleteTodo("not-exist");
		expect(del.success).toBe(false);
	});
});
