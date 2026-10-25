# Quiz Builder

A full-stack application for creating and managing quizzes, built with React, Express, Prisma, and PostgreSQL.

## Requirements

- Node.js 24+ and npm
- PostgreSQL

Clone the project:

```bash
git clone https://github.com/zrumyk/quiz-builder.git
cd quiz-builder
```

## 1. Set up the database

Start PostgreSQL and create a database:

```sql
CREATE DATABASE quiz_builder;
```

## 2. Start the backend

```bash
cd backend
npm ci
```

Copy `backend/.env.example` to `backend/.env` and configure your PostgreSQL credentials:

```env
PORT=3000
HOSTNAME=localhost
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/quiz_builder?schema=public"
```

Run migrations, generate the Prisma Client, and start the server:

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npm run dev
```

Backend: **http://localhost:3000**

## 3. Start the frontend

Open another terminal in the project root:

```bash
cd frontend
npm ci
```

Copy `frontend/.env.example` to `frontend/.env` and set:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Frontend: **http://localhost:5173**

## 4. Create a sample quiz

From the `backend` directory, run:

```bash
npx prisma db seed --config prisma7.config.ts
```

The seed creates a **JavaScript Basics** quiz with `BOOLEAN`, `INPUT`, and `CHECKBOX` questions. Running it again will not create a duplicate.

Open **http://localhost:5173/quizzes** to view the sample quiz.