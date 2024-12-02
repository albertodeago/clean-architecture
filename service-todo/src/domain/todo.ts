import type { Brand } from "../utils/types";

const TodoBrand = Symbol("Todo");

type Todo = {
    id: string;
    title: string;
    isCompleted: boolean;
    isArchived: boolean;
}

type DomainTodo = Brand<Todo, typeof TodoBrand>

const TodoFactory = (todo: Todo): DomainTodo => {
    return {
        id: todo.id, 
        title: todo.title, 
        isCompleted: todo.isCompleted, 
        isArchived: todo.isArchived,
    } as DomainTodo;
}

// port to define how to interact with the Domain
interface TodoRepository {
    listTodo: () => Promise<DomainTodo[]>;
    createTodo: (todo: DomainTodo) => Promise<DomainTodo>;
    updateTodo: (id: DomainTodo["id"], todo: DomainTodo) => Promise<DomainTodo>;
    deleteTodo: (id: DomainTodo["id"]) => Promise<void>;
    getTodo: (id: DomainTodo["id"]) => Promise<DomainTodo>;
}

export type { DomainTodo, TodoRepository };

export { TodoFactory };

