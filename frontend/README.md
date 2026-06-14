# Skippr Frontend

This is the React + Vite frontend for the Skippr booking and apartment management app.

## Features

- Responsive UI with React and Tailwind-style utility classes
- Auth flow powered by `react-hook-form` and `zustand`
- Protected admin and customer routes
- Toast notifications via `react-hot-toast`
- Axios API client for backend communication

## Folder Structure

```
frontend/
  public/
  src/
    assets/
    components/
      AdminDashBoard.jsx
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
  README.md
```

## Routes and Components

- `/` → `Home` (public landing page)
- `/login` → `Login` (public sign-in page)
- `/register` → `Register` (public registration page)
- `/verify-email` → `VerifyEmail` (public email OTP verification)
- `/customer` → `UserDashBaord` (protected `CUSTOMER` dashboard)
- `/admin` → `AdminDashBoard` (protected `ADMIN` dashboard)
  - `/admin` → `AdminOverview` (overview tab)
  - `/admin/blocks` → `AdminBlocks` (manage blocks)
  - `/admin/flats` → `AdminFlats` (manage flats)
  - `/admin/bookings` → `AdminBookings` (booking approvals)
  - `/admin/users` → `AdminUsers` (resident approvals)
  - `/admin/queries` → `AdminHelpQueries` (help queries)
- `/unauthorized` → `Unauthorized` (role access denied)
- `*` → `NotFound` (fallback page)

## Scripts

- `npm run dev` — start the frontend development server
- `npm run build` — build the app for production
- `npm run preview` — preview the production build

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the frontend server:
   ```bash
   npm run dev
   ```
3. Open the app in the browser on the port shown by Vite.

## Notes

- The frontend uses cookie-based JWT authentication for login.
- Admin routes are protected and require an admin user.
- Make sure the backend is running and accessible before using the app.
