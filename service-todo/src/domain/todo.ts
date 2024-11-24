
type TodoId = string;

type Todo = {
    id: TodoId;
    title: string;
    completed: boolean;
}

export { Todo, TodoId }