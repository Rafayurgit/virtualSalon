# Virtual Salon - Frontend (Vite + React + Tailwind)

## Overview
This is a minimal, production-ready frontend scaffold built with Vite, React and Tailwind CSS designed to work with the existing Node.js/Express backend in this workspace.

## Install

1. cd frontend
2. npm install
3. copy `.env.example` to `.env` and set `VITE_API_BASE` to your backend API (e.g. `http://localhost:5000/api`).

## Run

```
npm run dev
```

## Features included
- Vite + React + Tailwind scaffold
- Routing with `react-router-dom`
- Auth context + JWT token persistence (localStorage)
- Centralized `api` service (`src/services/api.js`) to talk to backend
- Core pages: Home, Salon listing, Salon details, Booking flow, Login, Signup, Dashboard
- Reusable UI components: Button, Input, Card, Modal, Loader, Navbar, Theme toggle
- Dark/Light/System theme support persisted to `localStorage`

## Notes / Next steps
- Run backend on the port set in `VITE_API_BASE`.
- Add richer UI, validation and forms according to needs.
- Consider storing tokens in secure httpOnly cookies for better security.

