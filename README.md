# Autone Prototypes

A Turborepo monorepo containing a React frontend with Storybook and an Express backend with Prisma ORM.

## Structure

```
prototypes/
├── turbo.json        # Turborepo configuration
├── packages/
│   ├── frontend/     # React + Vite + Storybook
│   └── backend/      # Express + Prisma + SQLite
```

## Prerequisites

- Node.js >= 18
- pnpm (`npm install -g pnpm`)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up the Database

Create the environment file for the backend:

```bash
echo 'DATABASE_URL="file:./dev.db"' > packages/backend/.env
```

Generate Prisma client and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### 3. Run Development Servers

Run both frontend and backend:

```bash
pnpm dev
```

Or run them separately:

```bash
pnpm dev:frontend  # http://localhost:5173
pnpm dev:backend   # http://localhost:3000
```

### 4. Run Storybook

```bash
pnpm storybook  # http://localhost:6006
```

## Available Scripts

| Script              | Description                           |
| ------------------- | ------------------------------------- |
| `pnpm dev`          | Run frontend and backend concurrently |
| `pnpm dev:frontend` | Run only the frontend                 |
| `pnpm dev:backend`  | Run only the backend                  |
| `pnpm build`        | Build all packages                    |
| `pnpm storybook`    | Run Storybook                         |
| `pnpm db:migrate`   | Run Prisma migrations                 |
| `pnpm db:push`      | Push schema changes to database       |
| `pnpm db:studio`    | Open Prisma Studio                    |
| `pnpm db:generate`  | Generate Prisma client                |

## API Endpoints

### Health Check

- `GET /api/health` - Check server and database status

### Users

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Tech Stack

**Monorepo:**

- Turborepo (build orchestration & caching)
- pnpm workspaces

**Frontend:**

- React 18
- Vite 6
- Storybook 8
- TypeScript

**Backend:**

- Express 4
- Prisma 6
- SQLite
- TypeScript
