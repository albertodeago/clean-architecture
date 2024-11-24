import { z } from "zod";

import type { Todo, TodoId } from "../domain/todo";

import { InputParseError } from "../domain/errors";

// This is responsible to map requests from outside to domain objects
// In doing this, also it handles validation, this way we can skip validations in the domain layer

const todoSchema = z.object({
    title: z.string().min(1),
    completed: z.boolean(),
    id: z.string()
});

const initTodoApplication = () => {

    return {
        createTodo: ({ title, completed, id }: { title: string, completed: boolean, id?: TodoId }): Todo  => {
            // Validation is being done at this level
            console.log("[application] Creating todo", { title, completed, id });

            const { data, error} = todoSchema.safeParse({ title, completed, id });

            if (error) {
                throw new InputParseError("Invalid input", { cause: error.message });
            }

            const todo = {
                id: data.id,
                title: data.title,
                completed: data.completed
            }

            return todo;
        }
    }
}

export { initTodoApplication }