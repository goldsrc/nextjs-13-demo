#!/bin/bash
# Run test database in docker
docker run --name test-postgres -d --rm -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=4y7sV96vA9wv46VR -e PGDATA=/var/lib/postgresql/data/pgdata -v $PWD/.testdb:/var/lib/postgresql/data -p 5432:5432 -it postgres:15-alpine