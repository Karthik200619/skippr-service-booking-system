# Skippr Backend

This backend provides the API layer for the Skippr application.

## Features

- Express server with JSON body parsing and cookie support
- JWT-based authentication and role-based access control
- Admin routes for blocks, flats, and booking approvals
- User routes for registration, login, logout, and booking operations
- Sequelize ORM for PostgreSQL database access

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the required environment variables, for example:
   ```env
   PORT=4000
   DATABASE_URL=postgres://user:password@localhost:5432/skippr
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
3. Start the backend:
   ```bash
   npm start
   ```

## Folder Structure

```
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
  seed.js
  server.js
  package.json
  README.md
```

## API Routes and Roles

### `/common-api`

- `GET /blocks` — public
- `GET /flats/by-block/:blockId` — public
- `POST /login` — public
- `POST /logout` — public
- `GET /check-auth` — `ADMIN`, `CUSTOMER`
- `GET /slots` — public

### `/user-api`

- `POST /register` — public
- `GET /services` — `CUSTOMER`, `ADMIN`
- `POST /book-service` — `CUSTOMER`
- `GET /my-bookings` — `CUSTOMER`
- `GET /service-slots` — `CUSTOMER`, `ADMIN`
- `POST /verify-otp` — public
- `POST /resend-otp` — public
- `POST /help-queries` — `CUSTOMER`

### `/admin-api`

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

## Notes

- The backend uses cookie-based JWT authentication for protected routes.
- Admin endpoints use a role guard to restrict access to admin users only.
- API endpoints are mounted under `/user-api`, `/common-api`, and `/admin-api`.
