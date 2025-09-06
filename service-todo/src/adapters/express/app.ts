import type { LoggerEnv } from "@/domain/logger";
import express from "express";
import type http from "http";
import {
	createTodo,
	deleteTodo,
	listTodo,
	toggleTodo,
	updateTodo,
	type TodoEnv,
} from "../../domain/todo";
import { z } from "zod";
import type { ConfigEnv } from "@/config";
import * as Sentry from "@sentry/node";

type Application = {
	start: () => void;
	stop: () => void;
};
export const makeHttpApplication = ({
	env,
}: {
	env: TodoEnv & LoggerEnv & ConfigEnv;
}): Application => {
	const { logger } = env;
	const app = express();
	app.use(express.json());
	let server: http.Server;

	logger.info("MakeHttpApplication");

	app.get("/todos", makeGetTodoHandler(env));
	app.post("/todos", makePostTodoHandler(env));
	app.put("/todos/:id/toggle", makeToggleTodoHandler(env));
	app.put("/todos/:id", makeUpdateTodoHandler(env));
	app.delete("/todos/:id", makeDeleteTodoHandler(env));

	// // This is just a fake route to test Sentry
	app.get("/debug-sentry", function mainHandler() {
		throw new Error("My first Sentry error!");
	});

	app.use(function notFoundHandler(_: express.Request, res: express.Response) {
		res.status(404).send("Not found");
	});

	// // The error handler must be registered before any other error middleware and after all controllers
	Sentry.setupExpressErrorHandler(app);

	// // Error handler middleware, beware that this is not catching thrown (and uncaught) errors, we should do that too but it's not the purpose of this example
	app.use(function errorHandler(
		err: Error,
		_: express.Request,
		res: express.Response,
	) {
		env.logger.error("Error handler caught error:", err);
		// sentry middleware already logs the error on Sentry
		res.status(500).json({ error: "Internal Server Error" });
	});

	return {
		start: () => {
			console.log(`Starting HTTP application`);
			server = app.listen(env.config.PORT, () => {
				console.log(`Server is running on port ${env.config.PORT}`);
			});
		},
		stop: () => {
			console.log(`Stopping HTTP application`);
			server?.close();
		},
	};
};

const makeGetTodoHandler =
	(env: TodoEnv & LoggerEnv) =>
	async (_req: express.Request, res: express.Response) => {
		env.logger.info("GET /todos");
		const todoResult = await listTodo()(env);

		if (!todoResult.success) {
			res.status(400).json({ error: todoResult.error.message });
		} else {
			res.json(todoResult.data);
		}
	};

const makePostTodoHandler =
	(env: TodoEnv & LoggerEnv): express.RequestHandler =>
	async (req: express.Request, res: express.Response) => {
		env.logger.info("POST /todos", req.body);

		const inputTodoSchema = z.object({
			title: z.string().min(1, { message: "Title is required" }),
		});
		const parseResult = inputTodoSchema.safeParse(req.body);
		if (!parseResult.success) {
			env.logger.warn(parseResult.error);
			res.status(400).json({
				error: z.prettifyError(parseResult.error),
			});
			return;
		}

		const todoResult = await createTodo(parseResult.data)(env);
		if (!todoResult.success) {
			res.status(400).json({ error: todoResult.error.message });
			return;
		}

		res.status(201).json(todoResult.data);
		return;
	};

const makeUpdateTodoHandler =
	(env: TodoEnv & LoggerEnv): express.RequestHandler =>
	async (req: express.Request, res: express.Response) => {
		env.logger.info("PUT /todos/:id", req.params["id"]);
		const id = req.params["id"];

		if (!id) {
			res.status(400).json({ error: "ID is required" });
			return;
		}

		const inputTodoSchema = z.object({
			title: z.string().min(1, { message: "Title is required" }),
			isCompleted: z.boolean().optional().default(false),
			isArchived: z.boolean().optional().default(false),
		});
		const parseResult = inputTodoSchema.safeParse(req.body);
		if (!parseResult.success) {
			env.logger.warn(parseResult.error);
			res.status(400).json({
				error: z.prettifyError(parseResult.error),
			});
			return;
		}

		const todoResult = await updateTodo(id, { id, ...parseResult.data })(env);
		if (!todoResult.success) {
			res.status(400).json({ error: todoResult.error.message });
			return;
		}

		res.status(201).json(todoResult.data);
		return;
	};

const makeToggleTodoHandler =
	(env: TodoEnv & LoggerEnv): express.RequestHandler =>
	async (req: express.Request, res: express.Response) => {
		env.logger.info("PUT /todos/:id/toggle", req.params["id"]);
		const id = req.params["id"];

		if (!id) {
			res.status(400).json({ error: "ID is required" });
			return;
		}

		const todoResult = await toggleTodo(id)(env);
		if (!todoResult.success) {
			res.status(400).json({ error: todoResult.error.message });
			return;
		}

		res.status(200).json(todoResult.data);
		return;
	};

const makeDeleteTodoHandler =
	(env: TodoEnv & LoggerEnv) =>
	async (req: express.Request, res: express.Response) => {
		env.logger.info("DELETE /todos/:id", req.params["id"]);
		const id = req.params["id"];

		if (!id) {
			res.status(400).json({ error: "ID is required" });
			return;
		}

		const todoResult = await deleteTodo(id)(env);
		if (!todoResult.success) {
			res.status(400).json({ error: todoResult.error.message });
			return;
		}

		res.status(204).send();
		return;
	};
