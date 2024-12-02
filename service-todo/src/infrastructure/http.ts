import express from "express";
import type { Express } from "express";
import type { TodoApplication } from "../application/todo";
import { TodoNotFoundError } from "../domain/errors";

// this module is responsible for handling http requests and responses
// it should get a service as input, and return an express app that
// connects the service to some http routes

// here we should do specific http validation and checks

const initHttpAdapter = ({ todoApplication }: { todoApplication: TodoApplication }): Express => {

    const app = express();
    app.use(express.json());

    app.get("/todos", async (req, res) => {
        console.log("[infrastructure][http] GET /todos");
        const todos = await todoApplication.listTodo();
        res.json(todos);
    });

    app.post("/todos", async (req, res) => {
        // TODO: should we have the id as a path parameter? I should check what's the best practice for this
        console.log("[infrastructure][http] POST /todos", req.body);
        const todo = await todoApplication.createTodo(req.body);
        res.json(todo);
    });

    app.put("/todos/:id/toggle", async (req, res) => {
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
        // should we have just 1 put method, where the user can edit the entire todo? Probably yes but this is a just an example
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

    return app;
}
    
export { initHttpAdapter }