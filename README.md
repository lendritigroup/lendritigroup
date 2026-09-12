# Lendriti Group SHPK

Professional heavy-equipment marketplace and private trading system for excavators, trucks and other machinery.

## Stack

- Next.js 16, TypeScript, Tailwind CSS
- Prisma + SQLite (local real database)
- next-intl: Albanian (default), English, German
- Cookie-based administrator authentication

## First run

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Administrator login

Set `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `AUTH_SECRET` in a local `.env` file (never commit that file). Change the defaults before any public deployment.

## What is public vs private

Public pages never receive purchase prices, costs, buyers, suppliers or profit/loss.

The admin dashboard, reports and individual transaction pages are available only after login.

## Company

Lendriti Group SHPK  
Rruga Minatorët e Trepqës, Mitrovicë, 40000, Kosovë  
Tel +383 49 272 125 · WhatsApp +383 44 272 125  
lendritigroupshpk@gmail.com
