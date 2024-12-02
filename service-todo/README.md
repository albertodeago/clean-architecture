# Service Todo

This is a simple todo service, following my version of clean architecture.

## TODO

- [ ] fully implement CRUD and use-cases to see how it fits
- [ ] add eslint and try to force project structure
- [ ] add logs
- [ ] handle errors
- [ ] add tests
- [ ] add observability
- [ ] add metrics
- [ ] can we make things dependant to the env like AleF was showing me?
- [ ] dockerize


## Code structure

Domain
- models
- errors
- interfaces (ports)
- they do not depend on anything (no imports from other folders)

infrastructure:
- they are the adapters, implement the interfaces/ports
- everything that interacts with the outside world goes here (changing a db or something should be just a matter of changing an adapter)

application:
- use-cases, business logic
- they accept the ports in input (then they receive adapters as implementations) and use them to achieve their goals

main:
- read config / env
- create the adapters and pass them to the services
