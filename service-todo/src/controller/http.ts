import type { Express, Request, Response, NextFunction } from 'express'
import express from 'express'
import bodyParser from 'body-parser'

import type { TodoRepository } from '../port/todo-repository';
import { initTodoApplication } from '../application/todo-application';

const defaultErrorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
    // console.error("[controller] Default error handler", error);
    // response.status(500).json({ error: error.message });
    // next();

    if (response.headersSent) {
        return next(error)
    }
    response.status(500).json({ error: error.message });
}

const initHttpController = (todoRepository: TodoRepository): Express => {
    const app: Express = express();
    const todoApplication = initTodoApplication();

    // enable json body parsing
    app.use(bodyParser.json());

    // default error handler
    app.use(defaultErrorHandler);

    app.get('/todos', async (req: Request, res: Response) => {
        const todos = await todoRepository.listTodo();
        res.json(todos);
    });

    app.post('/todos', async (req: Request, res: Response, next: NextFunction) => {
        console.log("[controller] Inserting todo", req.body);
        const domainTodo = todoApplication.createTodo(req.body);
        
        const todo = await todoRepository.createTodo(domainTodo);
        res.json(todo);
    });
    
    app.put('/todos/:id', async (req: Request, res: Response) => {
        const todo = await todoRepository.updateTodo(req.params.id, req.body);
        res.json(todo);
    });

    app.delete('/todos/:id', async (req: Request, res: Response) => {
        await todoRepository.deleteTodo(req.params.id);
        res.sendStatus(204);
    });

    return app;
};

export { initHttpController }