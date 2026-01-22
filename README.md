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

