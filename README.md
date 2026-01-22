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

