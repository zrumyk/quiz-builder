# Quiz Builder

A full-stack application for creating quizzes with Boolean, Input and Checkbox
questions. Browse quizzes, view their questions and correct answers in read-only
mode, and delete quizzes.

## Stack

- **Frontend:** React, Vite, TypeScript, React Router, React Hook Form, Zod, Axios.
- **Backend:** Express, TypeScript, Prisma 7, PostgreSQL.
- **Quality:** ESLint, Prettier, Jest with TypeScript transformation via SWC.
- **Styling:** black-and-white global CSS and locally bundled IBM Plex fonts.

## Requirements

- Node.js 24 LTS and npm.
- A running PostgreSQL server (developed with PostgreSQL 17).
- A dedicated database and a PostgreSQL user allowed to create its tables.

The application runs locally without containers. Commands below are executed
from the repository root unless another directory is shown.

## 1. Create the database

In pgAdmin's Query Tool, or in psql connected to the maintenance database
`postgres`, run this once:

```sql
CREATE DATABASE quiz_builder;
```

Skip this step if the database already exists. Do not use a database belonging
to another project.

## 2. Start the backend

```sh
cd backend
npm ci
```

Copy `backend/.env.example` to `backend/.env`. In PowerShell, from `backend`:

```powershell
Copy-Item .env.example .env
```

Do not overwrite an existing configured `.env`. Set your PostgreSQL credentials:

```dotenv
PORT=3000
HOSTNAME=localhost
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/quiz_builder?schema=public"
```

`YOUR_PASSWORD` is a placeholder, not a new password for PostgreSQL. URL-encode
special characters in the username/password when placing them in the URL.

Apply the committed migrations and generate the Prisma Client:

```sh
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npm run dev
```

The API runs at **http://localhost:3000**. Check **http://localhost:3000/api/health**
for the server's health response. This route checks the HTTP server; it does not
query the database.

The Prisma config file is named `prisma7.config.ts`; explicit `--config` arguments
are included here to make commands unambiguous.

## 3. Start the frontend

Open a second terminal:

```sh
cd frontend
npm ci
```

Copy `frontend/.env.example` to `frontend/.env` if it does not exist. In PowerShell,
from `frontend`:

```powershell
Copy-Item .env.example .env
```

Use the backend base URL, without `/api`:

```dotenv
VITE_API_URL=http://localhost:3000
```

```sh
npm run dev
```

Open the address printed by Vite, normally **http://localhost:5173**.
Restart Vite after changing `.env`. Variables prefixed with `VITE_` are public
browser configuration, so never put secrets in them.

## Environment files

| File            | Variables                          | Purpose                                |
| --------------- | ---------------------------------- | -------------------------------------- |
| `backend/.env`  | `PORT`, `HOSTNAME`, `DATABASE_URL` | Server address and database connection |
| `frontend/.env` | `VITE_API_URL`                     | Backend URL used by the browser        |

Both directories include `.env.example` with placeholder/local defaults.
Real `.env` files are ignored by Git. No root `.env` is required.

## Create a sample quiz

1. Open **Create** (`/create`) and enter **JavaScript basics** as the title.
2. Add a **Boolean** question: “JavaScript runs only in browsers.” Select **False**.
3. Add an **Input** question: “Which keyword declares a constant?” Enter **const**.
4. Add a **Checkbox** question: “Select primitive types.” Add **string**, **boolean**
   and **Array**; mark the first two as correct.
5. Select **Create quiz**. You are redirected to `/quizzes`.
6. Open the quiz title to view its questions and correct answers. The delete icon
   removes the quiz and its related questions/options.

You can also send this JSON to `POST http://localhost:3000/quizzes` with
`Content-Type: application/json`:

```json
{
  "title": "JavaScript basics",
  "questions": [
    {
      "type": "BOOLEAN",
      "text": "JavaScript runs only in browsers.",
      "booleanAnswer": false
    },
    {
      "type": "INPUT",
      "text": "Which keyword declares a constant?",
      "textAnswer": "const"
    },
    {
      "type": "CHECKBOX",
      "text": "Select primitive types.",
      "options": [
        { "text": "string", "isCorrect": true },
        { "text": "boolean", "isCorrect": true },
        { "text": "Array", "isCorrect": false }
      ]
    }
  ]
}
```

## Routes

Frontend: `/` redirects to `/quizzes`; `/create` creates a quiz;
`/quizzes/:id` shows read-only details.

| API method | Path           | Success response                              |
| ---------- | -------------- | --------------------------------------------- |
| POST       | `/quizzes`     | `201`, created quiz with questions/options    |
| GET        | `/quizzes`     | `200`, list of `id`, `title`, `questionCount` |
| GET        | `/quizzes/:id` | `200`, complete quiz                          |
| DELETE     | `/quizzes/:id` | `204`, no body                                |

Successful JSON responses use `{ "success": true, "data": ... }`.
Invalid input or UUID returns `400`; a missing quiz returns `404`.
Question and option order follows the order in the submitted form.

Each quiz needs a nonblank title and at least one question. Boolean questions
require a boolean answer (including `false`); Input questions require a nonblank
answer; Checkbox questions require at least two nonblank options and at least
one correct option. Multiple correct options are supported.

## Tests

From `backend`:

```sh
npm test
```

The test command first checks TypeScript types, then runs Jest with coverage.
Tests are organized like the application layers:

```text
backend/src/__tests__/
├── services/quiz.service.test.ts
├── controllers/quiz.controller.test.ts
├── middleware/error.middleware.test.ts
├── middleware/validate.middleware.test.ts
├── middleware/validate-params.middleware.test.ts
└── fixtures.ts
```

Services use mocked repositories; controllers use mocked services; middleware
uses mocked Express requests, responses and `next`. Tests cover success and
failure paths, missing quizzes, validation, response status/body, and forwarding
errors once. They do not connect to PostgreSQL or require `.env`.

Coverage is collected specifically for services, controllers and middleware.
This is unit-test coverage of those layers, not a measurement of the entire
application or database integration. Reports are written to `backend/coverage`.

```sh
npm run test:watch
```

## Quality checks and builds

Backend:

```sh
cd backend
npm run lint
npm run format:check
npm test
npm run build
npx prisma validate --config prisma7.config.ts
```

Frontend:

```sh
cd frontend
npm run lint
npm run format:check
npm run build
```

Both projects provide `npm run format` to apply formatting. Generated Prisma
files, coverage and build output are excluded. The supplied frontend
`globals.css` is deliberately excluded from automatic formatting.

To run the compiled backend after setup, use `npm run build` then `npm start`
inside `backend`. To preview the built frontend, run `npm run build` then
`npm run preview` inside `frontend`; the backend must still be running.

For a future database schema change, run
`npx prisma migrate dev --config prisma7.config.ts --name description`, then
`npx prisma generate --config prisma7.config.ts`. Commit the resulting migration.
Use `migrate deploy` when setting up an existing checkout, not `db push`.

## Project structure

```text
quiz-builder/
├── backend/
│   ├── prisma/             # Schema and committed migrations
│   └── src/
│       ├── configuration/
│       ├── controllers/
│       ├── exceptions/
│       ├── lib/
│       ├── middleware/
│       ├── repositories/
│       ├── routes/di/      # Constructor-based dependency wiring
│       ├── schemas/
│       ├── services/
│       └── __tests__/
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── services/       # All HTTP calls in api.ts
│       ├── schemas/
│       └── types/
└── README.md
```

The backend uses Repository → Service → Controller dependency injection.
Prisma creates a quiz and its questions/options atomically. Foreign-key cascade
deletion removes related records. The UI manages authoring and viewing only;
quiz solving, scores and authentication are outside this assessment's scope.
