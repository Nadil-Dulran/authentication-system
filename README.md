# Authentication System

Full‑stack authentication with JWT (HTTP‑only cookies), email verification via OTP, and password reset via OTP.

**Server**: Express, MongoDB (Mongoose), Nodemailer, JWT, Cookie Parser, CORS

**Client**: React (Vite), React Router, React‑Toastify, Tailwind CSS

---

**Features**
- **Register**: Create user, hash password, auto‑login (JWT cookie), send welcome email.
- **Login/Logout**: Issue and clear JWT stored in an HTTP‑only cookie.
- **Auth Guard**: `userAuth` middleware verifies JWT and attaches `userId` to the request.
- **Email Verification (OTP)**: Send/verify 6‑digit OTP, expires in 10 minutes.
- **Password Reset (OTP)**: Send/verify 6‑digit OTP, expires in 5 minutes, update password.
- **User Data**: Protected endpoint to fetch minimal user profile.

---

**How It Works**
- **JWT Session**: On successful register/login, server sets a `token` cookie with a signed JWT.
	- Cookie flags: `httpOnly`, `secure` and `sameSite` configured for prod/dev in [server/controllers/authController.js](server/controllers/authController.js).
	- Middleware verifies the cookie on protected routes and injects `userId` into the request body in [server/middleware/userAuth.js](server/middleware/userAuth.js).
- **Email Delivery**: OTP emails sent using Nodemailer transport configured in [server/config/nodemailer.js](server/config/nodemailer.js) with Brevo (SMTP Relay).
- **MongoDB**: Connects using [server/config/mongodb.js](server/config/mongodb.js) to `process.env.MONGODB_URI` and DB name `authentication-system`.
- **CORS**: Allowed origins configured in [server/server.js](server/server.js) and `credentials: true` to send cookies from the client.

---

**Data Model**
- See [server/models/userModel.js](server/models/userModel.js)
	- `name`, `email`, `password`
	- `verifyOtp`, `verifyOtpExpireAt`, `isAccountVerified`
	- `resetOtp`, `resetOtpExpireAt`

---

**API Endpoints**
- Base path: `/api/auth`
	- `POST /register` → Create user, set session cookie.
	- `POST /login` → Sign in, set session cookie.
	- `POST /logout` → Clear session cookie.
	- `POST /send-verify-otp` (protected) → Send verification OTP to logged‑in user.
	- `POST /verify-account` (protected) → Verify account with OTP.
	- `GET /is-auth` (protected) → Quick check the user is authenticated.
	- `POST /send-reset-otp` → Send password reset OTP to email.
	- `POST /reset-password` → Reset password with email + OTP + new password.

- Base path: `/api/user`
	- `GET /data` (protected) → Minimal profile for current user.

See implementations in:
- Router: [server/routes/authRoutes.js](server/routes/authRoutes.js), [server/routes/userRoutes.js](server/routes/userRoutes.js)
- Controllers: [server/controllers/authController.js](server/controllers/authController.js), [server/controllers/userController.js](server/controllers/userController.js)
- Middleware: [server/middleware/userAuth.js](server/middleware/userAuth.js)

---

**Request/Response Contracts (Quick Reference)**
- `POST /api/auth/register` body: `{ name, email, password }`
- `POST /api/auth/login` body: `{ email, password }`
- `POST /api/auth/send-verify-otp` cookie: `token`
- `POST /api/auth/verify-account` body: `{ userId, otp }` and cookie: `token`
- `POST /api/auth/send-reset-otp` body: `{ email }`
- `POST /api/auth/reset-password` body: `{ email, otp, newPassword }`
- `GET /api/user/data` cookie: `token` (reads `userId` from middleware)

All responses are JSON: `{ success: boolean, message?: string, ...payload }`.

---

**Environment Variables (.env)**
- Server (see [server/server.js](server/server.js))
	- `PORT` (default `4000`)
	- `MONGODB_URI` (e.g. `mongodb://127.0.0.1:27017`)
	- `JWT_SECRET` (random string)
	- `SENDER_EMAIL` (from‑address for emails)
	- `SMTP_USER`, `SMTP_PASS` (Brevo or your SMTP creds)
	- `NODE_ENV` (`development` or `production`) – toggles cookie flags

Example:

```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017
JWT_SECRET=changeme-very-secret
SENDER_EMAIL=you@example.com
SMTP_USER=your-brevo-user
SMTP_PASS=your-brevo-pass
NODE_ENV=development
```

---

**Run Locally**
1) Server
```bash
cd server
npm install
npm run server
```

2) Client
```bash
cd client
npm install
npm run dev
```

Ensure the client origin is allowed in [server/server.js](server/server.js) `allowedOrigins` and that the client sends credentials.

Client Axios example:
```js
axios.post('/api/auth/login', { email, password }, { withCredentials: true })
```
