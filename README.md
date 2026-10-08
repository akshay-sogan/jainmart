# Madhuram Project

This Angular application allows users to select a date, specify their menu (lunch, dinner, breakfast, high tea), indicate the number of people, and download a PDF of their selections.

## Features

- **Date Selection**: Users can choose a date for their meal.
- **Meal Selection**: Users can select from various meal options including lunch, dinner, breakfast, and high tea.
- **People Counter**: Users can specify the number of people for the selected meal.
- **PDF Download**: Users can download a PDF containing their selections.

## Project Structure

```
madhuram
├── src
│   ├── app
│   │   ├── components
│   │   │   ├── date-picker
│   │   │   ├── meal-selector
│   │   │   ├── people-counter
│   │   │   └── pdf-export
│   │   ├── services
│   │   ├── models
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.module.ts
│   ├── assets
│   ├── styles
│   ├── main.ts
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd madhuram
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Running the Application

To run the application, use the following command:
```
ng serve
```
Then open your browser and navigate to `http://localhost:4200`.

## MySQL catalog and Java API

The Spring Boot catalog API stores products in MySQL. Docker Compose starts both services,
and Flyway creates and seeds the product table on the API's first startup.

1. Install Docker Desktop and start it.
2. From the project root, start MySQL and the Java API:
   ```
   docker compose up --build
   ```
   Keep this running. The API listens on `http://localhost:8080`; its database
   schema is created by Flyway on startup. If the API container was already
   running before backend changes, rebuild and recreate it with
   `docker compose up --build --force-recreate api`.
3. In another terminal, start Angular:
   ```
   npm start
   ```
   Angular proxies `/api` requests to the backend, so the browser can use the
   same API path without cross-origin cookie/CORS issues during development.
4. Open `http://localhost:4200`. The API is available at
   `http://localhost:8080/api/products` (`GET` lists products; `POST` adds one).

The API requires Java 17 and Spring Boot and can also be run locally with Maven:
start MySQL with `docker compose up db`, then run `mvn spring-boot:run` from `backend`.
Configure database settings with `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`,
`MYSQL_USER`, and `MYSQL_PASSWORD`; `CORS_ALLOWED_ORIGINS` controls permitted
browser origins. The compose credentials are for local development only. Set
`MYSQL_PASSWORD` and `MYSQL_ROOT_PASSWORD` to strong values outside local development.
The production Angular build uses the same-origin `/api` path, so configure your
production reverse proxy to route `/api` to the Java API. Account creation and sign-in
are available at `POST /api/auth/signup` (`name`, `email`, `password`) and
`POST /api/auth/signin` (`email`, `password`). Both establish a server-side session;
`GET /api/auth/me` returns the current account and `POST /api/auth/signout` ends the
session. Accounts are stored in MySQL and passwords are BCrypt-hashed (at least 8
characters and no more than 72 UTF-8 bytes). New accounts have the `CUSTOMER` role. Product creation requires an
authenticated account with the `ADMIN` role. To grant catalog manager access,
promote a trusted account directly in the database with
`UPDATE users SET role = 'ADMIN' WHERE email = 'trusted@example.com';`; do not expose
public role assignment. Angular sends the session cookie when creating products and
signing out.

For example, sign-up returns `201 Created` with the user id, name, email, and role;
sign-in returns `200 OK` with the same response shape. Invalid credentials return
`401 Unauthorized`, duplicate email returns `409 Conflict`, and invalid request
fields return `400 Bad Request`. Sign-up must be sent as a `POST` request with a
JSON body, for example `{"name":"Test User","email":"test@example.com","password":"Password123"}`;
opening `/api/auth/signup` directly in a browser sends `GET`, for which no route exists.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.