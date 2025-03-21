import * as Sentry from "@sentry/node";
import { TodoNotFoundError } from "../domain/errors";
import { TodoFactory } from "../domain/todo";

import type { DomainTodo, TodoRepository } from "../domain/todo";
import type { Logger } from "../utils/logger";

/**
 * Adapters are responsible for implementing Ports (interface between domain and outside world)
 * Adapters can have different types compared to the domain ones, they then map between the two
 * (for example a Todo stored in a database has a different type than the domain Todo, can have the _id field specific to the database)
 * Here we also do validation and map outside world data to domain model -> TODO: is this correct?
 * or should we do validation in another place / in services that uses adapters?
 */

type MemoryTodo = DomainTodo & {
    _id: `${string}-${string}-${string}-${string}-${string}`;
}

const initMemoryTodoAdapter = ({ logger }: { logger: Logger }): TodoRepository => {
    logger.info("initMemoryTodoAdapter");
    const todoList: MemoryTodo[] = [];

    return {
        listTodo: async () => {
            logger.info("listTodo");
            return todoList.map(mapMemoryTodoToDomain);
        },
        createTodo: async (todo: { id: string, title: string }) => {
            return Sentry.startSpan({ name: "todo-pg.createTodo"}, () => {
                logger.info("createTodo", todo);

                const domainTodo = TodoFactory(todo);
                const memoryTodo = mapDomainTodoToMemory(domainTodo);

                logger.info("saved in memory", memoryTodo);
                todoList.push(memoryTodo);

                return mapMemoryTodoToDomain(memoryTodo);
            });

        },
        getTodo: async (id: DomainTodo["id"]) => {
            logger.info("getTodo", id);
            const t = todoList.find((t) => t.id === id);

            if (!t) {
                // TODO: is error handling correct here?
                // it should be useless, if we reach here the getTodo should have thrown an error
                throw new TodoNotFoundError("Todo not found");
            }

            logger.info("found in memory", t);
            return t;
        },
        updateTodo: async (id: DomainTodo["id"], todo: DomainTodo) => {
            const t = todoList.find((t) => t.id === id);
            if (!t) {
                throw new TodoNotFoundError("Todo not found");
            }

            t.title = todo.title;
            t.isCompleted = todo.isCompleted;
            return t;
        },
        deleteTodo: async (id: DomainTodo["id"]) => {
            const i = todoList.findIndex((t) => t.id === id);
            if (i === -1) {
                throw new TodoNotFoundError("Todo not found");
            }

            const [deleted] = todoList.splice(i, 1);
            return mapMemoryTodoToDomain(deleted);
        },
    }
}

const mapMemoryTodoToDomain = (memoryTodo: MemoryTodo): DomainTodo => {
    // we don't want to expose the _id to the outside world (just a stupid example)
    return TodoFactory({
        id: memoryTodo.id,
        title: memoryTodo.title,
        isCompleted: memoryTodo.isCompleted,
        isArchived: memoryTodo.isArchived
    });
}

const mapDomainTodoToMemory = (todo: DomainTodo): MemoryTodo => {
    // add the "hidden" _id field
    return {
        ...todo,
        _id: crypto.randomUUID()
    }
}

export {
    initMemoryTodoAdapter,
    mapMemoryTodoToDomain,
    mapDomainTodoToMemory
}
