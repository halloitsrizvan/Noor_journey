# 🕌 Noor Journey — Backend Server

> **Modular NestJS 11 REST API for Noor Journey**, a mobile-first Islamic learning platform designed for children aged 9–12 in Kerala, based on the intended Samastha Kerala Islam Matha Vidyabhyasa Board (SKIMVB) curriculum standards.

---

[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-4169E1.svg)](https://neon.tech/)
[![Vitest](https://img.shields.io/badge/Vitest-5.x-729B1B.svg)](https://vitest.dev/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D.svg)](#interactive-api-documentation)

---

## 📖 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Core Modules](#-core-modules)
- [Environment Configuration](#-environment-configuration)
- [Database & Prisma Commands](#-database--prisma-commands)
  - [Prisma Generation & Migrations](#prisma-generation--migrations)
  - [Idempotent Database Seeding](#idempotent-database-seeding)
  - [Administrator Account Bootstrapping](#administrator-account-bootstrapping)
- [Running the Server](#-running-the-server)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Security & Governance Framework](#-security--governance-framework)
  - [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
  - [Four-Eyes Editorial Review Principle](#four-eyes-editorial-review-principle)
  - [Child Profile Isolation & Ownership](#child-profile-isolation--ownership)
  - [Server-Authoritative Progression](#server-authoritative-progression)
  - [Spaced Repetition Engine](#spaced-repetition-engine)
- [API Route Reference](#-api-route-reference)
- [Interactive API Documentation](#-interactive-api-documentation)
- [Docker & Containerized Deployment](#-docker--containerized-deployment)

---

## 🏛️ Overview & Architecture

The **Noor Journey Server** powers the backend services, business logic, content review pipelines, and database state for the Noor Journey platform.

### Architectural Highlights:
- **Framework**: [NestJS 11](https://nestjs.com/) modular architecture written in strict TypeScript.
- **Database & Pooling**: [Neon Serverless PostgreSQL](https://neon.tech) supporting both pooled query execution (`DATABASE_URL`) and direct unpooled connection for migrations (`DATABASE_URL_UNPOOLED`).
- **ORM**: [Prisma 6](https://www.prisma.io/) with normalized schemas, foreign-key cascades, and atomic transaction handling.
- **Authentication**: Opaque, stateful server sessions stored in PostgreSQL. Tokens are hashed with SHA-256; passwords with Argon2id.
- **Security Protections**:
  - `HttpOnly`, `SameSite=Lax`, and `Secure` cookies.
  - Session-bound HMAC-SHA256 CSRF protection tokens.
  - Origin verification matching allowed frontend domains (`FRONTEND_ORIGINS`).
  - Child profile ownership guard preventing cross-account telemetry tampering.
  - Idempotency key headers for safe financial and XP transactions.
- **Timezone**: Standardized to `Asia/Kolkata` (IST) with `date-fns-tz` for accurate Madrasa daily prayer schedules and streak calculations.

---

## 📦 Core Modules

```text
server/src/modules/
├── auth/           # Parent registration, Argon2id login, session lifecycle, CSRF tokens
├── children/       # Child profile CRUD, avatar personalization, weekly study goals
├── content/        # Learning worlds, curriculum subjects, chapters, and mission delivery
├── madrasa/        # SKIMVB Madrasa subjects, curriculum topics, Al-Fatihah verses, Qari streams
├── attempts/       # Mission attempt orchestration, checkpoint grading, atomic finalization
├── reviews/        # Spaced repetition scheduler (1d -> 3d -> 7d -> retained) and review grading
├── rewards/        # XP ledger, level thresholds, badges, and cosmetic unlocks
├── reflections/    # Family dinner-table discussion prompts and reflection logs
├── parent-reports/ # Comprehensive child learning analytics and progress summaries
├── editorial/      # Four-eyes authoring, religious review, approval, publishing & withdrawal
└── health/         # Terminus liveness and database readiness probes
```

---

## ⚙️ Environment Configuration

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

### Environment Variable Glossary:

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | — | Neon pooled connection string for queries |
| `DATABASE_URL_UNPOOLED` | **Yes** | — | Neon direct connection string for schema migrations |
| `PORT` | No | `4000` | Port for the HTTP API server |
| `NODE_ENV` | No | `development` | `development`, `production`, or `test` |
| `APP_TIMEZONE` | No | `Asia/Kolkata` | Application timezone for streaks and schedules |
| `FRONTEND_ORIGINS` | **Yes** | `http://localhost:8080` | Comma-separated allowed CORS origins (no trailing slash) |
| `SESSION_COOKIE_NAME` | No | `noor_session` | Name of the HttpOnly session cookie |
| `SESSION_TTL_DAYS` | No | `7` | Days before session expiration |
| `SESSION_SECRET` | **Yes** | — | 32+ character random secret for HMAC CSRF tokens |
| `CSRF_COOKIE_NAME` | No | `noor_csrf` | Name of the CSRF token cookie |
| `ENABLE_DEMO_CONTENT` | No | `false` | Set `true` in dev to allow unreviewed demo fixtures |
| `CLOUDINARY_CLOUD_NAME`| No | — | Optional: Cloudinary cloud name for media assets |
| `CLOUDINARY_API_KEY` | No | — | Optional: Cloudinary API key |
| `CLOUDINARY_API_SECRET`| No | — | Optional: Cloudinary API secret |

---

## 🗄️ Database & Prisma Commands

### Prisma Generation & Migrations

```bash
# 1. Generate Prisma Client TypeScript typings
npm run prisma:generate

# 2. Apply migrations locally (uses DATABASE_URL_UNPOOLED)
npm run prisma:migrate

# 3. Apply migrations in production deployment pipeline
npm run prisma:deploy
```

### Idempotent Database Seeding

Populates 5 learning worlds, Chapter 1 (*Small Actions, Good Character*), 5 interactive missions, practice activities, checkpoints, Madrasa subjects, and Surah Al-Fatihah verse data:

```bash
npm run seed
```

> **Note**: Seed fixtures are labeled with `DEMO_UNREVIEWED`. In production environments (`NODE_ENV=production`), unreviewed demo content is shielded from public child access unless formally reviewed.

### Administrator Account Bootstrapping

Safely creates a new administrator or promotes an existing account without hardcoding credentials in seed scripts:

```bash
npm run bootstrap:admin -- admin@noorjourney.org "YourSuperSecurePassword123!"
```

---

## 🚀 Running the Server

```bash
# Development with hot-reload
npm run dev

# Production build
npm run build

# Start production server
npm run start:prod
```

Once running, verify endpoints:
- **API Base**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **Interactive Swagger Docs**: [http://localhost:4000/api/v1/docs](http://localhost:4000/api/v1/docs)
- **Liveness Probe**: [http://localhost:4000/api/v1/health/live](http://localhost:4000/api/v1/health/live)
- **Database Readiness Probe**: [http://localhost:4000/api/v1/health/ready](http://localhost:4000/api/v1/health/ready)

---

## 🧪 Testing & Quality Assurance

The server test suite utilizes [Vitest](https://vitest.dev/) for high-speed unit and integration testing:

```bash
# Run test suite once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

Test coverage includes:
- Authentication & session cookie mechanics.
- CSRF validation and rejection of forged tokens.
- Cross-account access blocking via `ChildOwnershipGuard`.
- Server-authoritative checkpoint grading and private key sanitization.
- XP deduplication using transaction locks.
- Spaced review scheduling algorithm.

---

## 🛡️ Security & Governance Framework

### Role-Based Access Control (RBAC)

The system enforces 4 hierarchical roles defined in `Role`:
1. `PARENT`: Default role upon registration. Manages child profiles, views summaries, and inputs reflections.
2. `AUTHOR`: Madrasa teachers and educational authors who draft mission versions and curriculum topics.
3. `REVIEWER`: Certified religious scholars who verify pedagogical and theological correctness.
4. `ADMIN`: System operators managing users, publications, and archival safety.

### Four-Eyes Editorial Review Principle

To guarantee theological accuracy:
- An `AUTHOR` creates a draft version for a mission.
- The author submits the draft for review (`/editorial/versions/:id/submit`).
- A `REVIEWER` inspects the submission (`/editorial/versions/:id/review`).
- **Enforced Constraint**: Authors are cryptographically and logically prohibited from reviewing or approving their own drafts.

### Child Profile Isolation & Ownership

Every child profile endpoint (`/api/v1/children/:childId/*`) is protected by `ChildOwnershipGuard`. The guard validates that:
$$\text{child}.\text{parentAccountId} == \text{currentSession}.\text{accountId}$$
Attempts to view or alter another parent's child profile immediately fail with `403 Forbidden` (`CHILD_NOT_OWNED`).

### Server-Authoritative Progression

1. Checkpoint question payloads delivered to the client **strip all correct answer indices and keys**.
2. Clients submit raw user responses (option ID, pair matches, order sequence).
3. The server evaluates answers against private database keys.
4. Passing requires $\ge 3$ correct answers out of 4 questions.
5. First completion awards **20 XP** in an atomic transaction; replaying completed missions does not award duplicated completion XP.

### Spaced Repetition Engine

Passing a mission triggers the Spaced Repetition scheduler:
- **Interval 1**: Due in 1 day (+24h)
- **Interval 2**: Due in 3 days (+72h)
- **Interval 3**: Due in 7 days (+168h)
- **Retained**: Mission concepts cemented into permanent memory.
- Completing a scheduled spaced review awards **5 XP** (once per stage).

---

## 📡 API Route Reference

### 🔐 Authentication & Session

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register parent account |
| `POST` | `/api/v1/auth/login` | Public | Login parent and set HttpOnly session cookie |
| `POST` | `/api/v1/auth/logout` | Authenticated | Revoke active session |
| `POST` | `/api/v1/auth/logout-all` | Authenticated | Revoke all active sessions for account |
| `GET` | `/api/v1/auth/me` | Authenticated | Get currently authenticated parent account |
| `GET` | `/api/v1/auth/csrf` | Authenticated | Retrieve session-bound CSRF token |
| `POST` | `/api/v1/auth/reauthenticate` | Authenticated | Re-verify parent password for protected actions |
| `POST` | `/api/v1/auth/change-password` | Authenticated | Change password and invalidate other sessions |

### 👶 Child Profile Management

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/children` | Parent | List all child profiles owned by parent |
| `POST` | `/api/v1/children` | Parent | Create a new child profile |
| `GET` | `/api/v1/children/:id` | Parent (Owner) | Get child profile details |
| `PATCH` | `/api/v1/children/:id` | Parent (Owner) | Update nickname, age band, language, weekly goal |
| `DELETE` | `/api/v1/children/:id` | Parent (Owner) | Delete child profile and cascading data |
| `PATCH` | `/api/v1/children/:childId/avatar` | Parent (Owner) | Update child active avatar cosmetic |

### 🗺️ Learning Content & Journey

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/worlds` | Public | Get all 5 learning worlds |
| `GET` | `/api/v1/subjects` | Public | Get curriculum subjects |
| `GET` | `/api/v1/children/:childId/journey` | Parent (Owner) | Child journey roadmap, world progress & active nodes |
| `GET` | `/api/v1/children/:childId/chapters/:chapterId`| Parent (Owner) | Chapter overview with mission milestones |
| `GET` | `/api/v1/children/:childId/missions/:missionId`| Parent (Owner) | Mission activities (checkpoint answers stripped) |

### 📖 Madrasa & Quran Curriculum

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/madrasa/subjects` | Public | Get all Madrasa subjects and curriculum topics |
| `GET` | `/api/v1/madrasa/subjects/:key` | Public | Get specific Madrasa subject by key (e.g. `tajweed`) |
| `POST` | `/api/v1/madrasa/subjects` | Public/Author | Create new Madrasa subject |
| `PUT` | `/api/v1/madrasa/subjects/:id` | Public/Author | Update Madrasa subject |
| `DELETE` | `/api/v1/madrasa/subjects/:id` | Public/Admin | Delete Madrasa subject |
| `POST` | `/api/v1/madrasa/subjects/:id/topics` | Public/Author | Add curriculum topic to subject |
| `PUT` | `/api/v1/madrasa/topics/:topicId` | Public/Author | Update curriculum topic |
| `DELETE` | `/api/v1/madrasa/topics/:topicId` | Public/Admin | Delete curriculum topic |
| `GET` | `/api/v1/madrasa/fatihah` | Public | Get Surah Al-Fatihah 7 verses and Tajweed metadata |
| `PUT` | `/api/v1/madrasa/fatihah/:verseId` | Public/Admin | Update Al-Fatihah verse data and Tajweed rules |
| `GET` | `/api/v1/madrasa/quran/reciters` | Public | Get list of available renowned Quran Qaris |
| `GET` | `/api/v1/madrasa/quran/fatihah/audio` | Public | Get Surah Al-Fatihah audio streams by Qari |

### 🎯 Mission Attempts & Checkpoint Grading

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/children/:childId/missions/:missionId/attempts` | Parent (Owner) | Initialize mission attempt session |
| `GET` | `/api/v1/children/:childId/attempts/:attemptId` | Parent (Owner) | Fetch attempt progress and state |
| `POST` | `/api/v1/children/:childId/attempts/:attemptId/activities/:activityId/submissions` | Parent (Owner) | Submit and server-grade learning activity |
| `POST` | `/api/v1/children/:childId/attempts/:attemptId/checkpoints` | Parent (Owner) | Initialize checkpoint assessment session |
| `POST` | `/api/v1/children/:childId/checkpoints/:checkpointId/answers` | Parent (Owner) | Submit raw answer for checkpoint question |
| `POST` | `/api/v1/children/:childId/checkpoints/:checkpointId/finalize` | Parent (Owner) | Atomic transaction: grade score, award 20 XP, schedule spaced review |

### 🔄 Spaced Repetition Reviews

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/children/:childId/reviews` | Parent (Owner) | Get reviews currently due for child |
| `POST` | `/api/v1/children/:childId/reviews/:reviewId/attempts` | Parent (Owner) | Start spaced review attempt session |
| `POST` | `/api/v1/children/:childId/review-attempts/:attemptId/answers` | Parent (Owner) | Submit answers for review questions |
| `POST` | `/api/v1/children/:childId/review-attempts/:attemptId/finalize` | Parent (Owner) | Finalize review (5 XP, advances 1d $\to$ 3d $\to$ 7d $\to$ retained) |

### 🏆 Progress, Rewards & Reflections

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/children/:childId/progress` | Parent (Owner) | Total XP, current level, weekly study days |
| `GET` | `/api/v1/children/:childId/collection` | Parent (Owner) | Earned chapter badges and unlocked cosmetics |
| `GET` | `/api/v1/children/:childId/reflections` | Parent (Owner) | View family reflection notes |
| `POST` | `/api/v1/children/:childId/reflections` | Parent (Owner) | Record new family reflection note |
| `DELETE` | `/api/v1/children/:childId/reflections/:id` | Parent (Owner) | Delete a reflection note |
| `GET` | `/api/v1/children/:childId/summary` | Parent (Owner) | Comprehensive parent progress & analytics report |

### 📝 Editorial & Content Governance

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/editorial/overview` | Admin, Reviewer | Get editorial overview and review backlog stats |
| `POST` | `/api/v1/editorial/missions/:missionId/draft` | Author, Admin | Create new draft version for a mission |
| `POST` | `/api/v1/editorial/versions/:versionId/submit` | Author, Admin | Submit draft for editorial and religious review |
| `POST` | `/api/v1/editorial/versions/:versionId/review` | Reviewer, Admin | Approve or reject draft (Four-eyes: Author cannot review) |
| `POST` | `/api/v1/editorial/versions/:versionId/publish`| Reviewer, Admin | Publish reviewed version to child audience |
| `POST` | `/api/v1/editorial/versions/:versionId/archive`| Admin | Archive an outdated mission version |
| `POST` | `/api/v1/editorial/versions/:versionId/withdraw`| Admin | Emergency safety withdrawal of a published version |
| `DELETE` | `/api/v1/editorial/students/:studentId` | Admin | Delete a specific student profile |
| `DELETE` | `/api/v1/editorial/students` | Admin | Clean up / purge all student profiles (testing/admin) |

### 🩺 Health & Diagnostics

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health/live` | Public | Liveness probe checking process availability |
| `GET` | `/api/v1/health/ready` | Public | Readiness probe checking PostgreSQL database connectivity |

---

## 📑 Interactive API Documentation

When the server is running in development or testing mode, interactive Swagger OpenAPI 3.0 documentation is available at:

```
http://localhost:4000/api/v1/docs
```

The documentation features:
- Live request execution ("Try it out").
- Complete request/response JSON schemas with validation constraints.
- Cookie authentication parameter declarations.

---

## 🐳 Docker & Containerized Deployment

### Multi-Stage Production Build

The included [`Dockerfile`](file:///server/Dockerfile) utilizes Alpine Linux, installs OpenSSL for Prisma engine compatibility, strips development dependencies, and produces a minimal production image:

```bash
# Build the Docker image
docker build -t noor-journey-server .

# Run the container
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://user:password@neon-host/neondb?sslmode=require" \
  -e DATABASE_URL_UNPOOLED="postgresql://user:password@neon-direct/neondb?sslmode=require" \
  -e FRONTEND_ORIGINS="http://localhost:8080" \
  -e SESSION_SECRET="your_secure_32_char_secret_key" \
  noor-journey-server
```

---

*Serving quality Islamic education with architectural excellence.* 🌙
