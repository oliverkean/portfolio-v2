# Portfolio Management System

Next.js, TypeScript, PostgreSQL, Prisma, and Tailwind CSS.

## Local setup

1. Copy the environment template and set your login details:

   ```powershell
   Copy-Item .env.example .env
   ```

   Set `OWNER_EMAIL`, `OWNER_PASSWORD`, and `OWNER_NAME` in `.env`. The seeded account can access `/login` and `/studio`.

2. Start PostgreSQL with Docker Desktop running:

   ```powershell
   docker compose up -d
   ```

3. Generate the Prisma client, apply migrations, and seed the portfolio:

   ```powershell
   npm run prisma:generate
   npm run prisma:migrate -- --name initial_schema
   npm run prisma:seed
   ```

4. Start the application:

   ```powershell
   npm run dev
   ```

Open `http://localhost:3000/login`, then use the credentials from `.env`.

## Database workflow

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Seed: `prisma/seed.ts`
- Client: `src/lib/prisma.ts`

During development, change the Prisma schema, then create a named migration:

```powershell
npm run prisma:migrate -- --name describe_your_change
npm run prisma:generate
```

For a production database, set `DATABASE_URL` and the owner variables in the deployment provider's secret manager. Apply committed migrations with:

```powershell
npm run prisma:deploy
```

Do not commit `.env` or use the local owner password in production.

## Deployment preflight

The production build runs `prisma generate` before `next build`. This is required because the generated Prisma client is intentionally excluded from Git.

Deploy only after these steps:

1. Provision a managed PostgreSQL database and set its connection string as `DATABASE_URL` in the hosting provider.
2. Set unique production values for `OWNER_EMAIL`, `OWNER_PASSWORD`, and `OWNER_NAME` in the provider's secret manager.
3. Apply the committed migrations once with `npm run prisma:deploy`.
4. Seed the initial owner and portfolio once with `npm run prisma:seed`.

The current upload implementation writes to the local filesystem. It is suitable for Docker-based development, but it must be replaced with object storage such as Amazon S3 before using project or resume uploads in a serverless deployment.
