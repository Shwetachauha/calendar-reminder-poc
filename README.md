# Calendar Reminder & Alert Management POC

Frontend-only proof of concept built with Next.js App Router, TypeScript, Tailwind CSS, MUI, Zustand, Axios, React Hook Form, and Zod.

## Features

- Mock authentication with token + userId persistence
- Protected routes with login redirection
- Responsive dashboard with sidebar and top navbar
- Event listing with search and date filter
- Create event modal with React Hook Form + Zod validation
- Dummy Google/Outlook calendar sync simulation
- Reminder and alert simulation with browser notifications
- Event details drawer
- Settings page
- Reusable, modular, scalable folder architecture

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- MUI + Emotion
- Zustand
- Axios + axios-mock-adapter
- React Hook Form + Zod
- Day.js
- Framer Motion
- Sonner

## Project Structure

```text
src/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/dashboard/
│   ├── (dashboard)/settings/
│   └── layout.tsx
├── components/
│   ├── common/
│   ├── events/
│   └── layout/
├── modules/
│   ├── auth/
│   └── events/
├── services/
│   ├── api/
│   └── calendar/
├── hooks/
├── store/
├── types/
├── utils/
├── mock/
├── providers/
└── constants/
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
npm run dev
```

4. Open http://localhost:3000

## Demo Credentials

- Email: chauhansweeta24@gmail.com
- Password: password123

## Scripts

- `npm run dev` - Run local dev server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - ESLint checks
- `npm run typecheck` - TypeScript checks

## Notes

- No backend is required. APIs are mocked via Axios mock adapter.
- Events are persisted in localStorage.
- Reminder simulation runs on the client using interval polling.
