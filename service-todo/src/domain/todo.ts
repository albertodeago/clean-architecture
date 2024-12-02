import type { Brand } from "../utils/types";
import { InputParseError } from "./errors";

const TodoBrand = Symbol("Todo");

type Todo = {
    id: string;
    title: string;
    isCompleted?: boolean;
    isArchived?: boolean;
}

type DomainTodo = Brand<Todo, typeof TodoBrand>

const TodoFactory = (todo: Todo): DomainTodo => {
    // TODO: this validation would be a lot easier with Zod or something
    if (typeof todo.id !== "string" || todo.id.length === 0) {
        throw new InputParseError("Invalid todo id");
    }
    if (typeof todo.title !== "string" || todo.title.length === 0) {
        throw new InputParseError("Invalid todo title");
    }

    return {
        id: todo.id, 
        title: todo.title, 
        isCompleted: todo.isCompleted ?? false, 
        isArchived: todo.isArchived ?? false,
    } as DomainTodo;
}

// port to define how to interact with the Domain
interface TodoRepository {
    listTodo: () => Promise<DomainTodo[]>;
    createTodo: (todo: { id: string, title: string }) => Promise<DomainTodo>;
    updateTodo: (id: DomainTodo["id"], todo: DomainTodo) => Promise<DomainTodo>;
    deleteTodo: (id: DomainTodo["id"]) => Promise<DomainTodo>;
    getTodo: (id: DomainTodo["id"]) => Promise<DomainTodo>;
}

export type { DomainTodo, TodoRepository };

export { TodoFactory };

