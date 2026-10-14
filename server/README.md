# Noor Journey — Backend Server

Modular NestJS backend REST API for **Noor Journey**, a mobile-first Islamic learning platform designed for children aged 9–12 in Kerala, based on the intended Samastha Kerala Islam Matha Vidyabhyasa Board (SKIMVB) curriculum.

---

## 1. Stack & Architecture

- **Framework**: NestJS 11 with TypeScript
- **Database**: PostgreSQL (Neon Serverless with pooling support)
- **ORM**: Prisma 6 with explicit normalized schema and migrations
- **Authentication**: Opaque server-side sessions with SHA-256 token hashing and Argon2id password hashing
- **Security**: HttpOnly cookies, origin validation, session-bound HMAC-SHA256 CSRF protection, and Idempotency keys
- **API Spec**: OpenAPI 3.0 / Swagger documentation at `/api/v1/docs`

---

## 2. Environment Configuration

Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```

Key environment variables:
- `DATABASE_URL`: Neon pooled PostgreSQL connection string (for queries)
- `DATABASE_URL_UNPOOLED`: Neon direct PostgreSQL connection string (for migrations)
- `PORT`: Server port (default: `4000`)
- `NODE_ENV`: `development` | `production` | `test`
- `FRONTEND_ORIGINS`: Comma-separated list of allowed origins (e.g. `http://localhost:8080,http://localhost:8081`)
- `SESSION_COOKIE_NAME`: Cookie name for session (default: `noor_session`)
- `SESSION_TTL_DAYS`: Session expiration time in days (default: `7`)
- `SESSION_SECRET`: Secret used for session-bound CSRF token HMAC generation
- `ENABLE_DEMO_CONTENT`: `true` to allow seeding unreviewed demo fixtures (strictly `false` in production)

---

## 3. Database Commands

### Generate Prisma Client
```powershell
npm run prisma:generate
```

### Apply Migrations
```powershell
# In development (with direct URL)
npm run prisma:migrate

# In production / release pipeline
npm run prisma:deploy
```

### Seed Demo Content (Idempotent)
Populates 5 worlds, Chapter 1 (*Small Actions, Good Character*), and 5 missions with practice activities and checkpoints:
```powershell
npm run seed
```
*Note: All seed fixtures are explicitly labelled `DEMO_UNREVIEWED` with curriculum mapping pending.*

### Bootstrap Administrator Account
Safely creates or promotes an initial administrator without hardcoding credentials:
```powershell
npm run bootstrap:admin -- admin@noorjourney.org "SecureAdminP@ss123"
```

---

## 4. Running the Server

```powershell
# Development with watch mode
npm run start:dev

# Production build and run
npm run build
npm run start:prod
```

Once running, access:
- **API Base**: `http://localhost:4000/api/v1`
- **Swagger Documentation**: `http://localhost:4000/api/v1/docs`
- **Liveness Probe**: `http://localhost:4000/api/v1/health/live`
- **Readiness Probe**: `http://localhost:4000/api/v1/health/ready`

---

## 5. Running Tests

Run the test suite verifying authentication security, child profile ownership, atomic finalization, XP deduplication, and spaced revision scheduling:
```powershell
npm test
```

---

## 6. Security & Authorization

### Role-Based Access Control
- `PARENT`: Default role for all public registrations. Owns and manages child profiles.
- `AUTHOR`: Creates and edits draft mission versions.
- `REVIEWER`: Approves or rejects submitted mission versions. *(Enforces four-eyes principle: authors cannot review their own drafts)*.
- `ADMIN`: Manages releases, system settings, and archival.

### Child Profile Ownership
Every child endpoint (`/api/v1/children/:childId/*`) validates that the requesting parent account owns the child profile via `ChildOwnershipGuard`. Cross-account access returns `403 Forbidden` (`CHILD_NOT_OWNED`).

### Server-Authoritative Progression
- Clients submit raw user responses (option ID, pair matches, sequence order).
- The server evaluates submissions against private answer definitions.
- Checkpoint pools strip answer keys in client responses; feedback is returned only upon submission.
- Passing requires $\ge 3$ out of 4 correct checkpoint answers.
- Passing awards exactly **20 XP** on first completion (deduplicated via `Idempotency-Key`).
- Replays do not duplicate completion XP.
- Spaced review occurs at 1-day, 3-day, and 7-day intervals; passing a scheduled review awards **5 XP** once.

---

## 7. API Route Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Parent registration (always creates `PARENT`) |
| `POST` | `/api/v1/auth/login` | Parent login (sets HttpOnly cookie) |
| `POST` | `/api/v1/auth/logout` | Revokes current session |
| `POST` | `/api/v1/auth/logout-all` | Revokes all account sessions |
| `GET` | `/api/v1/auth/me` | Returns current parent account |
| `GET` | `/api/v1/auth/csrf` | Returns session-bound CSRF token |
| `POST` | `/api/v1/auth/reauthenticate` | Re-verifies adult password |
| `POST` | `/api/v1/auth/change-password` | Updates password and revokes other sessions |
| `GET` | `/api/v1/children` | List parent's child profiles |
| `POST` | `/api/v1/children` | Create child profile |
| `GET` | `/api/v1/children/:id` | Get child profile details |
| `PATCH` | `/api/v1/children/:id` | Update child profile |
| `DELETE` | `/api/v1/children/:id` | Delete child profile |
| `PATCH` | `/api/v1/children/:childId/avatar` | Update child's active avatar |
| `GET` | `/api/v1/worlds` | List all 5 learning worlds |
| `GET` | `/api/v1/subjects` | List curriculum subjects |
| `GET` | `/api/v1/children/:childId/journey` | Get child's journey map and node states |
| `GET` | `/api/v1/children/:childId/chapters/:chapterId` | Chapter overview |
| `GET` | `/api/v1/children/:childId/missions/:missionId` | Mission content (checkpoint answers stripped) |
| `POST` | `/api/v1/children/:childId/missions/:missionId/attempts` | Start mission attempt |
| `GET` | `/api/v1/children/:childId/attempts/:attemptId` | Get attempt status |
| `POST` | `/api/v1/children/:childId/attempts/:attemptId/activities/:activityId/submissions` | Server grades activity |
| `POST` | `/api/v1/children/:childId/attempts/:attemptId/checkpoints` | Start checkpoint |
| `POST` | `/api/v1/children/:childId/checkpoints/:checkpointId/answers` | Submit checkpoint answer |
| `POST` | `/api/v1/children/:childId/checkpoints/:checkpointId/finalize` | Atomic transaction for completion, XP, review schedule, badges |
| `GET` | `/api/v1/children/:childId/reviews` | Spaced reviews due for child |
| `POST` | `/api/v1/children/:childId/reviews/:reviewId/attempts` | Start review attempt |
| `POST` | `/api/v1/children/:childId/review-attempts/:attemptId/answers` | Submit review answers |
| `POST` | `/api/v1/children/:childId/review-attempts/:attemptId/finalize` | Finalize review (5 XP, advances stage: 1d $\to$ 3d $\to$ 7d $\to$ retained) |
| `GET` | `/api/v1/children/:childId/progress` | Summary of XP, level, and weekly sessions |
| `GET` | `/api/v1/children/:childId/collection` | Earned chapter badges and avatar cosmetics |
| `GET` | `/api/v1/children/:childId/reflections` | Family reflections log |
| `POST` | `/api/v1/children/:childId/reflections` | Record family reflection note |
| `DELETE` | `/api/v1/children/:childId/reflections/:id` | Delete reflection note |
| `GET` | `/api/v1/children/:childId/summary` | Parent summary report |
| `GET` | `/api/v1/health/live` | Liveness check |
| `GET` | `/api/v1/health/ready` | Database readiness check |
