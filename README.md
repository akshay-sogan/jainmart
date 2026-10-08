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

## Docker

Docker Compose runs the Angular app, Spring Boot API, and MySQL database. Flyway
creates and seeds the database schema on the API's first startup.

1. Install Docker Desktop and start it.
2. From the project root, build and start the full application:
   ```
   docker compose up --build
   ```
3. Open `http://localhost` to use the application. The API is also available
   directly at `http://localhost:8080/api/products`.
4. To stop the containers, press Ctrl+C and run:
   ```
   docker compose down
   ```
   Database files persist in the `mysql-data` volume. To also delete the local
   database, run `docker compose down --volumes`.

Set `MYSQL_PASSWORD` and `MYSQL_ROOT_PASSWORD` in the environment before starting
Compose to override the local-development database credentials. The defaults in
Compose are for local development only.

## Local development

To run Angular outside Docker, start MySQL and the API with
`docker compose up db api`, then run `npm start` in another terminal and open
`http://localhost:4200`. The Angular development server proxies `/api` requests
to the API. The API can also be run locally with Java 17 and Maven using
`mvn spring-boot:run` from `backend`.
Configure database settings with `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`,
`MYSQL_USER`, and `MYSQL_PASSWORD`; `CORS_ALLOWED_ORIGINS` controls permitted
browser origins.
The production Angular build uses the same-origin `/api` path, so configure your
production reverse proxy to route `/api` to the Java API. Account creation and sign-in
are available at `POST /api/auth/signup` (`name`, `email`, `password`,
`mobileNumber`, optional `role`) and
`POST /api/auth/signin` (`email`, `password`). Signup creates an account but does not
sign the user in; the user must sign in afterward. Shopkeeper signup remains pending
until an admin activates it. Sign-in establishes a server-side session, `GET /api/auth/me`
returns the current account and `POST /api/auth/signout` ends the session. Accounts are
stored in MySQL and passwords are BCrypt-hashed (at least 8
characters and no more than 72 UTF-8 bytes). New accounts default to the `CUSTOMER`
role. Public signup may request `CUSTOMER` or `SHOPKEEPER`, but never `ADMIN`.
Signup saves profile name, email, mobile number, and enabled status into the dedicated
`customers` or `shopkeepers` table as well as the authentication account. Existing
accounts are copied into these tables by the migration; their mobile number is blank
until provided on a new signup. Shopkeeper accounts are created disabled and must be approved by an admin before
sign-in. To grant catalog manager access,
promote a trusted account directly in the database with
`UPDATE users SET role = 'ADMIN' WHERE email = 'trusted@example.com';`; do not expose
public role assignment. Admins can review and enable or pause shopkeepers through
`GET /api/admin/shopkeepers` and `PUT /api/admin/shopkeepers/{id}/status` with
`{"enabled":true}` or `{"enabled":false}`. Both endpoints require an admin session.
Admins can view an individual shopkeeper's inventory with
`GET /api/products/shopkeeper/{shopkeeperId}`; the endpoint requires an admin session.

Customers can browse all products from active shops with `GET /api/products` and
view an individual product with `GET /api/products/{id}`. Shopkeepers can manage
only products they own, while admins can manage every product. The authenticated
`GET /api/products/manage/{shopkeeperId}` returns only the signed-in shopkeeper's
products; the API checks that the requested id matches the current session.
`GET /api/products/manage` returns every product to an admin. Product ownership uses
the matching shopkeeper profile/account ID. Use `POST /api/products` to add a product,
`PUT /api/products/{id}` to replace an existing product's name, category, description,
price, and unit, and `DELETE /api/products/{id}` to remove a product. Create and update
accept a JSON body with those five fields; update and delete return `404 Not Found` when
the product id does not exist or the caller does not own it. Product changes return
`401 Unauthorized` without a session and `403 Forbidden` for customer accounts. The
Angular admin workspace includes shopkeeper approval and marketplace-wide product
management; shopkeepers see only their own store inventory. Customer product cards
include a detail view. All management calls send the session cookie.

For example, sign-up returns `201 Created` with the user id, name, email, role, and
enabled state; sign-in returns `200 OK` with the same response shape. Invalid credentials return
`401 Unauthorized`, duplicate email returns `409 Conflict`, and invalid request
fields return `400 Bad Request`. Sign-up must be sent as a `POST` request with a
JSON body, for example `{"name":"Test User","email":"test@example.com","password":"Password123"}`;
opening `/api/auth/signup` directly in a browser sends `GET`, for which no route exists.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.