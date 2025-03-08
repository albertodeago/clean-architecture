# Service Todo

This is a simple todo service, following my version of clean architecture.

## TODO

- [x] fully implement CRUD and use-cases to see how it fits
- [x] add eslint and try to force project structure
- [x] add unit tests
- [x] add logs
- [x] add observability (connect sentry)
- [x] add metrics (connect sentry)
- [ ] handle errors (zod? Maybe monads?) - should we only handle errors in the "main" or only in "use-cases", or what?
  - [ ] would it be easier with Zod?
- [ ] can we make things dependant to the env like AleF was showing me?
- [x] dockerize
- [ ] can we remove useless checks in todo-memory if we switch to a fp-ts approach of error handling?
      maybe we can have methods that return a "safeTodo" or something, to specify in a typed way that
      we know that is not going to throw errors because we already validated and checked that path?
      The alternative is to move all the logic there (infra) and just pass (e.g. title) from the application to the infra

- Same but for a frontend app (react ?) - do we use a diff framework to learn it?
- Same but for a metaframewok app (nextjs ?) - do we use a diff framework to learn it?

## Code structure

Domain
- models
- errors
- interfaces (ports)
- they do not depend on anything (no imports from other folders)

Adapters:
- implement the interfaces/ports (they also called `infrastructure` sometimes)
- everything that interacts with the outside world goes here (changing a db or something should be just a matter of changing an adapter)
- ATM they are adapters for the domain (e.g. a pg implementation) and also for dependencies that I want to "encalpsulate" to make them easier to change (e.g. http server, maybe tomorrow we want hono instead of express)

application:
- use-cases, business logic
- they accept the ports in input (then they receive adapters as implementations) and use them to achieve their goals

main:
- read config / env
- create the adapters and pass them to the services
