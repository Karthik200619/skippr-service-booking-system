# Skippr — Service Booking System

This repository contains Skippr, a web application for apartment communities to manage facility bookings, resident registrations, and admin approvals.

## Summary

- Frontend: React + Vite single-page app (user & admin dashboards, protected routes)
- Backend: Express.js API with Sequelize (PostgreSQL) for data persistence and JWT cookie auth
- Notifications: Email (Brevo) and WhatsApp (Twilio)

## Development: Admin Test Credentials

For local development or testing (seeded user), use the following admin account:

- Email: `admin@skippr.com`
- Password: `123456`

Warning: This account is seeded for development only. 

## Tech Stack

- Frontend: React, Vite, Zustand, react-hook-form, axios, react-hot-toast
- Backend: Node.js, Express, Sequelize, PostgreSQL
- Dev: Vite (frontend dev server proxy), nodemon

## Workspace Layout

```
SkipprV1/
  backend/
    apis/
      AdminApi.js
      CommonApi.js
      UserApi.js
    config/
      cloudinary.js
      cloudinaryUpload.js
      db.js
      multer.js
    middleware/
      verifyToken.js
    models/
      ApartmentModel.js
      BlockModel.js
      BookingModel.js
      FlatModel.js
      NotificationModel.js
      OtpModel.js
      ServiceModel.js
      SlotModel.js
      UserModel.js
      index.js
    service/
      authService.js
      whatsappService.js
    seed.js
    server.js
    package.json
    .env

  frontend/
    public/
    src/
      assets/
      components/
        AdminDashBoard.jsx
        admin/* (AdminOverview, AdminBlocks, AdminFlats, AdminBookings, AdminUsers, AdminHelpQueries)
        BookSlot.jsx
        Footer.jsx
        Header.jsx
        Home.jsx
        Login.jsx
        NotFound.jsx
        ProtectedRoute.jsx
        Register.jsx
        RootLaylout.jsx
        SlotBooking.jsx
        SlotCards.jsx
        Unauthorized.jsx
        UserDashBaord.jsx
        VerifyEmail.jsx
      store/
        authStore.js
      styles/
        common.js
      App.jsx
      main.jsx
    package.json
    vite.config.js

  README.md (this file)
```

## API Routes (quick reference)

All APIs are mounted under these prefixes in `backend/server.js`:

- `/common-api` (public / auth checks)
  - `GET /blocks` — public
  - `GET /flats/by-block/:blockId` — public
  - `POST /login` — public (sets httpOnly cookie)
  - `POST /logout` — public
  - `GET /check-auth` — `ADMIN`, `CUSTOMER`
  - `GET /slots` — public

- `/user-api` (customer-facing)
  - `POST /register` — public (multipart/form-data)
  - `GET /services` — `CUSTOMER`, `ADMIN`
  - `POST /book-service` — `CUSTOMER`
  - `GET /my-bookings` — `CUSTOMER`
  - `GET /service-slots` — `CUSTOMER`, `ADMIN`
  - `POST /verify-otp` — public
  - `POST /resend-otp` — public
  - `POST /help-queries` — `CUSTOMER`

- `/admin-api` (admin-only)
  - `POST /block` — `ADMIN`
  - `GET /blocks` — `ADMIN`
  - `POST /flat` — `ADMIN`
  - `GET /flats` — `ADMIN`
  - `GET /bookings` — `ADMIN`
  - `PATCH /bookings/:bookingId/approve` — `ADMIN`
  - `PATCH /bookings/:bookingId/reject` — `ADMIN`
  - `PATCH /bookings/:bookingId/reject-others` — `ADMIN`
  - `GET /users` — `ADMIN`
  - `PATCH /users/:userId/approve` — `ADMIN`
  - `PATCH /users/:userId/reject` — `ADMIN`
  - `PUT /users/:userId` — `ADMIN`
  - `GET /help-queries` — `ADMIN`
  - `PATCH /help-queries/:queryId/resolve` — `ADMIN`

For detailed route logic see `backend/apis/*.js`.

## Environment Variables

Backend (`backend/.env`) — examples used by the project:

- `PORT` — server port (default 4000)
- `DATABASE_URL` — Postgres connection URL
- `JWT_SECRET` — JWT signing secret
- `CLOUD_NAME`, `API_KEY`, `API_SECRET` — Cloudinary
- `EMAIL_USER`, `EMAIL_PASS` — mailing (Brevo / SMTP)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER` — WhatsApp notifications

Frontend env (recommended):

- `VITE_API_URL` — base URL for the backend (e.g. `https://skippr-service-booking-system.onrender.com`)

Currently axios baseURL is configured in `frontend/src/main.jsx` and `frontend/src/store/authStore.js`.

## Setup & Run (local development)

Backend:

```bash
cd backend
npm install
# create .env with required variables (see backend/.env example)
npm start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Notes:
- Vite dev server proxies `/common-api`, `/user-api`, `/admin-api` to the backend (see `vite.config.js`).
- Axios is configured with `withCredentials` to support cookie-based auth.

## Database

- Sequelize is used to manage models and `sequelize.sync({ alter: true })` is called on startup to apply model changes. For production, prefer migrations.

## Authentication

- Cookie-based JWT. `verifyToken` middleware in `backend/middleware/verifyToken.js` checks for a valid token and enforces role-based access (ADMIN, CUSTOMER).

## Deployment

- Backend example deployed at: `https://skippr-service-booking-system.onrender.com`
- Frontend can be deployed to any static hosting (Vercel, Netlify, Render) — ensure `VITE_API_URL` or axios baseURL points to the backend and CORS allows your frontend origin.

## Contributing

- Keep changes focused: avoid modifying API routes unless coordinated with frontend.
- Remove or reduce console.debug/log statements before production.

## Troubleshooting

- If auth fails, ensure cookies are being set by the backend (sameSite, secure flags) and `axios.defaults.withCredentials = true` is enabled in the frontend.
- Check `backend/server.js` for proxy/CORS configuration when debugging local dev proxy issues.

## Contact

If you need help running the project or adding features, open an issue or contact the maintainer.

## AI Tools & Prior Work

- AI tools referenced during design and planning:
  - **AntiGravity** — used for ideation and some logic/styling step guidance.
  - **ChatGPT** — assisted with schema building and examples.
  - **Claude** — used to refine and optimize schema design for efficiency.

These tools were used as assistants for design and iteration; the code, implementation and final decisions were implemented and curated by the project author.

## Libraries & Prior Practices

- Frontend: many choices (including `react-router`, `react-hook-form`, `axios`, `zustand`, `react-hot-toast`) were informed by previous projects and established practices. These libraries provide routing, form handling, HTTP client behavior, lightweight state management, and toast notifications respectively.
- Backend: core authentication and security patterns (JWT-based auth, `bcrypt` password hashing, `httpOnly` cookies for session tokens) were applied from prior experience and then adapted/refined for this project. Basic route structure was defined early and later improved with role-based guards and notification flows.

If you'd like these notes migrated into individual component READMEs (frontend/backend), I can split them accordingly.
