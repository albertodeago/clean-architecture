import express from "express";
import type { Express } from "express";
import type { TodoApplication } from "../application/todo";

// this module is responsible for handling http requests and responses
// it should get a service as input, and return an express app that
// connects the service to some http routes

const initHttpAdapter = ({ todoApplication }: { todoApplication: TodoApplication }): Express => {

    const app = express();
    app.use(express.json());

    app.get("/todos", async (req, res) => {
        console.log("[infrastructure][http] GET /todos");
        const todos = await todoApplication.listTodo();
        res.json(todos);
    });

    app.post("/todos", async (req, res) => {
        // here we should do specific http validation and checks
        console.log("[infrastructure][http] POST /todos", req.body);
        const todo = await todoApplication.createTodo(req.body);
        res.json(todo);
    });

    app.put("/todos/:id", async (req, res) => {
        // TODO: we have 2 put methods, we should have only one
        const todo = await todoApplication.updateTodoTitle(req.params.id, req.body.title);
        res.json(todo);
    });

    app.delete("/todos/:id", async (req, res) => {
        await todoApplication.deleteTodo(req.params.id);
        res.status(204).send();
    });

    app.put("/todos/:id/toggle", async (req, res) => {
        const todo = await todoApplication.toggleTodoCompleted(req.params.id);
        res.json(todo);
    });

    return app;
}

export { initHttpAdapter }