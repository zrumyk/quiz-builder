# Quiz Builder frontend

React + Vite + TypeScript with React Router, React Hook Form and Zod.

## Run locally

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env` and set `VITE_API_URL` to the backend URL, without `/api` (for example, `http://localhost:3000`).
3. Start the backend in a separate terminal.
4. Run `npm run dev` and open the address printed by Vite.

Restart Vite after changing environment variables.

## Pages

- `/quizzes`: quiz list and deletion.
- `/create`: quiz creation with Boolean, Input and Checkbox questions.
- `/quizzes/:id`: read-only questions and correct answers.

## Structure

- `src/pages`: route-level pages.
- `src/components`: shared layout, rows and question components.
- `src/services/api.ts`: all HTTP requests.
- `src/schemas`: form validation and payload conversion.
- `src/types`: API data types.

## Checks

```sh
npm run build
npm run lint
npm run format:check
```

## Styling

`src/globals.css` is the supplied stylesheet and is kept unchanged, including by Prettier. `src/index.css` only defines the IBM Plex font variables. Font files are bundled through `@fontsource` imports in `src/main.tsx`.
