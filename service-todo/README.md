# Service Todo

This is a simple todo service, following my version of clean architecture.

## TODO

- [x] fully implement CRUD and use-cases to see how it fits
- [x] add eslint and try to force project structure
- [x] add unit tests
- [x] add logs
- [x] add observability (connect sentry)
- [x] add metrics (connect sentry)
- [x] catch all errors in express to easier observability?
- [x] dockerize

- Same but for a frontend app (react ?) - do we use a diff framework to learn it?
- Same but for a metaframewok app (nextjs ?) - do we use a diff framework to learn it?

## Code structure

- src/domain
Contains the business logic of the application. it **must** be independent from specific technologies or frameworks.
It can contains single files or folders (only if complexity requires it).
Every file should be named after the entity it represents (e.g. `todo.ts` for a todo entity) and it exports:
  - the TypeScript types needed to model the entity
  - a Typescript type that represent the domain ports (interfaces) needed to interact with the entity
  - Functions that represents the use-cases that can be performed on the entity (e.g. `createTodo`, `deleteTodo`, etc.). The use-case is what must be used by the application layer to interact with the entity. The use-cases must use currying to receive the input data as first arguments and the environment (implementation of ports) as the last argument.
  - Errors that can be *returned* (not thrown) by the use-cases (e.g. `TodoNotFoundError`)
- src/adapters
Contains the implementations of the domain ports (interfaces). It must be independent from the application layer.
It must be organized in folders that represent the technology or framework used (e.g. `pg`, `memory`, `http`, etc.).
Each folder should contain a file named after the entity it implements (e.g. `todo-pg.ts` for a todo entity using Postgres) and it *can* contain
other files if complexity requires it (for example to implement common utilities for the specific technology).
- src/env
Env is a container of adapters, basically is what the entire application will use to interact with the outside world.
- src/main
It creates the environment (the adapters) and connects everything together.
It must be as simple as possible and it should not contain any business logic.

### Error handling
We discourage the usage of exceptions for error handling. Instead, we suggest to use a simple Result<T, E> type (implemented in the `domain/result`).
The domain exports also a TryCatch<T, E> type that can be used to wrap functions that can throw exceptions and convert them to Result<T, E>.

### Testing
Tests must be as simple as possible and must leverage dependency injection to mock dependencies (whenever possible).

## How to try

Insert a todo:
```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"title": "xyz"}' \
  http://localhost:3000/todos
```

List todos:
```bash
curl http://localhost:3000/todos
```

Get a todo:
```bash
curl http://localhost:3000/todos/{id}
```

Update a todo:
```bash
curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"title": "new title", "isCompleted": true, "isArchived": false}' \
  http://localhost:3000/todos/{id}
```

Delete a todo:
```bash
curl --header "Content-Type: application/json" \
  --request DELETE \
  http://localhost:3000/todos/{id}
```
