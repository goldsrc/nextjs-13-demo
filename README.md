# Next.js Demo

This is the demo project for the
[Next.js 13.4](https://nextjs.org/blog/next-13-4) app router

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/) >= 18
- [pnpm](https://pnpm.io/) >= 8
- [Docker](https://docs.docker.com/engine/install/) >= 20

### Install Dependencies

```bash
cd next-13-demo
pnpm install
```

## Env Variables

```bash
cp .env.example .env
```

## Prisma

### Generate Prisma Client (Needed for Database Connection and Development)

```bash
npx prisma generate
```

### Reset DB

```bash
npx prisma db reset
```

### Seed DB

```bash
npx prisma db seed
```

### Production DB

```bash
npx prisma migrate deploy
```

## Development

```bash
pnpm dev
```

## Production

```bash
pnpm build
pnpm start
```

## Notes

- You can use a free [NeonDB](https://neon.tech) Postgres database, but any
  Prisma compatible DB will work.
- You can use [Docker](https://docs.docker.com/engine/install/) to run a local
  Postgres database. (see `db.sh`)
- You can use [Vercel](https://vercel.com) to deploy your Next.js app for free.
