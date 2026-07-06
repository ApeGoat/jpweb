# jpweb

- `frontend/` contains the React application.
- `backend/` contains the Spring Boot API and PostgreSQL/Flyway resources.
- `docker-compose.yml` runs the local PostgreSQL database.

## Frontend

```sh
cd frontend
npm install
npm start
```

## PostgreSQL

The Compose file has development defaults. To customize them, copy `.env.example`
to `.env` and change the credentials before starting the database.

```sh
docker compose up -d db
docker compose ps
```

PostgreSQL is exposed on `localhost:5432` by default. Stop it with
`docker compose down`; add `--volumes` only when you intentionally want to erase
the local database data.

## Backend

Configure the R2 and admin values in `.env`, then run:

```sh
cd backend
mvn spring-boot:run
```
