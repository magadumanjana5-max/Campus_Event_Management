# Campus Event Management System

Beginner-to-intermediate MERN stack project intended for BCA freshers. Implements a simple campus event management system with student and admin roles.

Tech
- React + Bootstrap (frontend)
- Node.js + Express (backend)
- MongoDB + Mongoose
- JWT authentication, role-based authorization
- REST APIs

Folder structure
- backend/ — Express API, models, controllers, routes
- frontend/ — React app, Bootstrap UI

Getting started (backend)
1. Install dependencies

```bash
cd backend
npm install
```

2. Create `.env` (copy from `.env.example`) and set `MONGO_URI` and `JWT_SECRET`

3. Run server

```bash
npm run dev
```

API (summary)
- POST /api/auth/register — register user (name,email,password)
- POST /api/auth/login — login (email,password)
- GET /api/events — list events (query: `q`, `date`, `location`)
- GET /api/events/:id — get event details
- POST /api/events — create event (admin)
- PUT /api/events/:id — update event (admin)
- DELETE /api/events/:id — delete event (admin)
- GET /api/events/stats — aggregation stats (admin)
- POST /api/registrations/events/:id/register — register for event (student)
- GET /api/registrations/my — my registrations (student)
- DELETE /api/registrations/:id — cancel registration (student or admin)
- GET /api/registrations/events/:id — list registrations for event (admin)

Authentication
- Uses JWT in `Authorization: Bearer <token>` header. Tokens returned from `/api/auth/login` and `/api/auth/register`.
- New accounts default to `student`. To create an `admin`, an existing admin must be logged in while submitting the registration form with the admin role selected. The frontend exposes this as `Add User` for admins.

Frontend (quick)
1. Install deps

```bash
cd frontend
npm install
npm start
```

Notes for BCA freshers
- Keep models simple: `User`, `Event`, `Registration` with references between them.
- Auth middleware demonstrates JWT verification and role checks.
- Use `express-validator` for basic request validation and handle errors centrally in controllers.
- Aggregation example (`/api/events/stats`) shows how to compute registrations per event.

Next steps / learning tasks
- Add pagination, file uploads for event images
- Improve UI/UX and form validation on frontend
- Add unit/integration tests

License: MIT
# Campus_Event_Management