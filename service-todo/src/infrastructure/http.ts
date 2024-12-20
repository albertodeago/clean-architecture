import express from "express";
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

    app.get("/todos", async (req, res) => {
        logger.info("GET /todos");
        const todos = await todoApplication.listTodo();
        res.json(todos);
    });

    app.post("/todos", async (req, res) => {
        logger.info("POST /todos", req.body);
        const todo = await todoApplication.createTodo(req.body);
        res.json(todo);
    });

    app.put("/todos/:id/toggle", async (req, res) => {
        logger.info("PUT /todos/:id/toggle", req.params.id);
        try {
            const todo = await todoApplication.toggleTodoCompleted(req.params.id);
            res.json(todo);
        } catch (error) {
            if (error instanceof TodoNotFoundError) {
                res.status(404).send(error.message);
            } else {
                res.status(500).send("Internal server error");
            }
        }
    });

    app.put("/todos/:id", async (req, res) => {
        logger.info("PUT /todos/:id", req.params.id, req.body.title);
        try {
            const todo = await todoApplication.updateTodoTitle(req.params.id, req.body.title);
            res.json(todo);
        } catch (error) {
            if (error instanceof TodoNotFoundError) {
                res.status(404).send(error.message);
            } else {
                res.status(500).send("Internal server error");
            }
        }
    });

    app.delete("/todos/:id", async (req, res) => {
        logger.info("DELETE /todos/:id", req.params.id);
        try {
            const todo = await todoApplication.deleteTodo(req.params.id);
            res.json(todo);
        } catch (error) {
            if (error instanceof TodoNotFoundError) {
                res.status(404).send(error.message);
            } else {
                res.status(500).send("Internal server error");
            }
        }
    });

    // This is just a fake route to test Sentry
    app.get("/debug-sentry", function mainHandler(req, res) {
        throw new Error("My first Sentry error!");
    });

    // The error handler must be registered before any other error middleware and after all controllers
    Sentry.setupExpressErrorHandler(app);

    // TODO: setup a 404 handler
    // TODO: setup a error middleware
    app.use(function onError(err, req, res, next) {
        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        res.statusCode = 500;
        res.end(res.sentry + "\n");
    });

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