import express, { NextFunction, Request, Response } from "express";
import { TodoNotFoundError } from "../domain/errors";
import * as Sentry from "@sentry/node"

import type { Logger } from "../utils/logger";
import type http from "http";
import type { TodoApplication } from "../application/todo";
import type { Config } from "../config";

// this module is responsible for handling http requests and responses
// it should get a service as input, and return an express app that
// connects the service to some http routes

// here we should do specific http validation and checks

const initHttpAdapter = ({ todoApplication, config, logger }: { todoApplication: TodoApplication, config: Config, logger: Logger }): { run: () => void, stop: () => void } => {
    logger.info("initHttpAdapter");
    const app = express();
    let server: http.Server
    app.use(express.json());

    app.get("/todos", async (_, res) => {
        logger.info("GET /todos");
        const todos = await todoApplication.listTodo();
        res.json(todos);
    });

    app.post("/todos", async (req, res, next) => {
        logger.info("POST /todos", req.body);
        try {
            const todo = await todoApplication.createTodo(req.body);
            res.json(todo);
        } catch (error) {
            next(error);
        }
    });

    app.put("/todos/:id/toggle", async (req, res, next) => {
        logger.info("PUT /todos/:id/toggle", req.params.id);
        try {
            const todo = await todoApplication.toggleTodoCompleted(req.params.id);
            res.json(todo);
        } catch (error) {
            next(error)
        }
    });

    app.put("/todos/:id", async (req, res, next) => {
        logger.info("PUT /todos/:id", req.params.id, req.body.title);
        try {
            const todo = await todoApplication.updateTodoTitle(req.params.id, req.body.title);
            res.json(todo);
        } catch (error) {
            next(error)
        }
    });

    app.delete("/todos/:id", async (req, res, next) => {
        logger.info("DELETE /todos/:id", req.params.id);
        try {
            const todo = await todoApplication.deleteTodo(req.params.id);
            res.json(todo);
        } catch (error) {
            next(error);
        }
    });

    // This is just a fake route to test Sentry
    app.get("/debug-sentry", function mainHandler() {
        throw new Error("My first Sentry error!");
    });

    app.use(function notFoundHandler(_: Request, res: Response) {
        res.status(404).send("Not found");
    })

    // The error handler must be registered before any other error middleware and after all controllers
    Sentry.setupExpressErrorHandler(app);

    // Error handler middleware, beware that this is not catching thrown (and uncaught) errors, we should do that too but it's not the purpose of this example
    app.use(function errorHandler(err: Error, _: Request, res: Response, next: NextFunction) {
        if (err instanceof TodoNotFoundError) {
            res.status(404).json({ error: err.message });
        } else {
            console.error(err.stack);
            // sentry middleware already logs the error on Sentry
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })


    return {
        run: () => {
            server = app.listen(config.port, () => {
                logger.info(`Server is running on port ${config.port}`);
            });
        },
        stop: () => {
            server?.close();
        }
    };
}

export { initHttpAdapter }
