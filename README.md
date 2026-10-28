# 🌙 Noor Journey (നൂർ ജേർണി)

> **Children's Islamic Value & Knowledge Learning Platform**  
> An engaging, interactive, values-first Islamic Learning and Madrasa companion designed for children aged 9–12 (aligned with the intended Samastha Kerala Islam Matha Vidyabhyasa Board / SKIMVB curriculum standards), with parent monitoring and editorial review governance.

---

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-4169E1.svg)](https://neon.tech/)
[![License](https://img.shields.io/badge/License-Proprietary-yellow.svg)](#license)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Repository Structure](#-repository-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Clone and Install](#1-clone-and-install)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Database Setup & Seeding](#3-database-setup--seeding)
  - [4. Run in Development Mode](#4-run-in-development-mode)
  - [5. Run with Docker Compose](#5-run-with-docker-compose)
- [Monorepo Scripts](#-monorepo-scripts)
- [Curriculum & Religious Governance](#-curriculum--religious-governance)
- [Documentation & Deep Dives](#-documentation--deep-dives)
- [Deployment](#-deployment)
- [Ethics & Child Safety](#-ethics--child-safety)

---

## 🌟 Overview

**Noor Journey** blends joyful gamification with authentic Islamic learning. Tailored for young learners, it introduces foundational Islamic values, ethics (Akhlaq), worship practices (Fiqh), creed (Aqeedah), and Quranic recitation (Tajweed) in an encouraging, pressure-free environment.

The platform provides:
1. **Kid-Centric Interface**: Mobile-first, vibrant UI featuring visual journey maps, avatar customizations, audio-guided missions, and mini-games.
2. **Pedagogical Integrity**: Server-authoritative grading, bite-sized checkpoints (3/4 pass threshold), and automated spaced review intervals (1-day, 3-day, and 7-day).
3. **Parental Trust**: Adult re-authentication barriers, screen time visibility, learning milestones, and family reflection logs.
4. **Editorial Governance**: Four-eyes review pipeline for religious scholarship verification before any content reaches children.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client ["Client (Frontend — React 19 + TanStack Start)"]
        UI["Kid-Friendly UI / Mobile-First PWA"]
        Journey["Journey Map & Adventure Nodes"]
        TajweedStudio["Surah Al-Fatihah & Tajweed Studio"]
        Games["Noor Dino Runner & Mini-Games"]
        ParentPortal["Parent Dashboard & Family Reflections"]
        AdminPortal["Editorial & Admin Portal"]
    end

    subgraph Server ["Server (Backend — NestJS 11 REST API)"]
        AuthModule["Auth & Session Guard (Argon2id + SHA-256)"]
        ChildGuard["Child Ownership Guard & Profile Isolation"]
        ContentModule["Content & Journey Engine"]
        MadrasaModule["Madrasa Curriculum & Audio Streamer"]
        AttemptsModule["Server-Authoritative Grader & Checkpoints"]
        ReviewModule["Spaced Repetition Scheduler (1d / 3d / 7d)"]
        EditorialModule["Four-Eyes Content Review & Publishing"]
        HealthModule["Liveness & Readiness Probes"]
    end

    subgraph Database ["Data & Storage Layer"]
        NeonDB[("PostgreSQL (Neon Serverless)")]
        AudioStore["Quran Reciter Audio CDNs"]
    end

    UI -->|HTTP / Cookies / Session-bound CSRF| AuthModule
    UI --> ContentModule
    TajweedStudio --> MadrasaModule
    Games --> UI
    ParentPortal --> ChildGuard
    AdminPortal --> EditorialModule

    MadrasaModule --> AudioStore
    AuthModule --> NeonDB
    ContentModule --> NeonDB
    AttemptsModule --> NeonDB
    ReviewModule --> NeonDB
    EditorialModule --> NeonDB
```

---

## ✨ Key Features

### 🗺️ Interactive Learning Journey
- **5 Thematic Worlds**: Faith & Wonder, Daily Practice, Beautiful Character, Stories of Wisdom, and Arabic/Quran.
- **Bite-Sized Missions**: Interactive learning steps containing audio narrations, flash cards, sequence sorting, and matching pairs.
- **Checkpoint Assessments**: Private server-side answer keys ensure fairness; children need 3 out of 4 correct to pass.
- **Gamified Rewards**: Deduplicated XP points, chapter completion badges, and avatar accessory unlocks.

### 🎙️ Surah Al-Fatihah & Tajweed Studio
- Verse-by-verse recitation with renowned Qaris (Mishary Rashid Alafasy, Abdul Basit, Al-Husary, and more).
- Visual color-coded Tajweed indicators (Idgham, Ikhfa, Qalqalah, Madd, Ghunnah).
- Bilingual translations in Malayalam and English alongside Arabic typography.

### 🎮 Islamic Playground & Games
- **Noor Dino Runner**: Canvas-based runner where players leap over distractions and obstacles, gather Noor lanterns, activate prayer buffs, and dodge obstacles with sound effects.
- **Interactive Quizzes & Puzzles**: Reinforce concepts learned in missions through joyful play.

### 🧠 Spaced Review & Retention
- Automatic spaced repetition scheduling after completing any mission (at 1-day, 3-day, and 7-day intervals).
- Retained review rewards encouraging sustainable study habits without cramming.

### 👨‍👩‍👧 Parent Dashboard & Reflections
- **Protected Adult Gate**: Password-protected area ensuring parents control account settings.
- **Weekly Goals & Progress**: Track completed missions, XP velocity, and subject balance.
- **Family Reflection Prompts**: Post-mission conversational questions to inspire meaningful dinner-table discussions.

### 🛡️ Editorial & Four-Eyes Governance
- Explicit role-based access control (`PARENT`, `AUTHOR`, `REVIEWER`, `ADMIN`).
- Separation of duties: authors cannot review or publish their own mission drafts.
- Safety withdrawal and version archival mechanisms to protect religious authenticity.

---

## 📁 Repository Structure

```text
Noor_journey/
├── client/                     # Frontend Application (React 19, TanStack Start, Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI, games, journey, tajweed & parent components
│   │   │   ├── admin/          # Editorial & Admin tools
│   │   │   ├── games/          # Canvas games (NoorDinoRunner, IslamicGamesScreen)
│   │   │   ├── journey/        # Adventure map, node rendering & mission player
│   │   │   ├── parent/         # Parent dashboard, reports, child management
│   │   │   └── ui/             # Radix UI + Tailwind styled primitives
│   │   ├── routes/             # TanStack Router routes (journey, games, tajweed, etc.)
│   │   └── styles.css          # Tailwind CSS v4 design system
│   ├── Dockerfile              # Multi-stage production Nginx container
│   ├── package.json            # Client scripts & dependencies
│   └── README.md               # Client documentation
├── server/                     # Backend API (NestJS 11, Prisma 6, PostgreSQL)
│   ├── src/
│   │   ├── common/             # Guards (Auth, Roles, Csrf, ChildOwnership), filters, decorators
│   │   ├── config/             # Environment validation with Zod
│   │   ├── database/           # PrismaService with Neon connection handling
│   │   └── modules/            # Core feature modules (auth, children, content, madrasa, etc.)
│   ├── prisma/                 # Database schema definition and seed fixtures
│   ├── scripts/                # Utility scripts (e.g. bootstrap-admin)
│   ├── Dockerfile              # Multi-stage production Node.js container
│   ├── package.json            # Server scripts & dependencies
│   └── README.md               # Backend API documentation
├── DEPLOYMENT.md               # Cloud deployment guide (Render, Vercel, Neon)
├── docker-compose.yml          # Local multi-container Docker setup
├── Islamic_Learning_PRD.md     # Detailed Product Requirements & Curriculum Specification
├── package.json                # Root package with monorepo orchestration scripts
└── render.yaml                 # Render.com Blueprint configuration
```

---

## 💻 Prerequisites

Ensure you have the following installed locally:
- **Node.js**: `v20.x` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v10.x` or higher (or **Bun** `v1.2+`)
- **PostgreSQL**: PostgreSQL 15+ database (or a free [Neon Serverless PostgreSQL](https://neon.tech) account)
- **Docker & Docker Compose** *(Optional, for containerized execution)*

---

## 🚀 Quick Start Guide

### 1. Clone and Install

Clone the repository and install dependencies across the monorepo:

```bash
git clone https://github.com/your-username/Noor_journey.git
cd Noor_journey

# Install root dependencies
npm install

# Install client and server dependencies
npm --prefix server install
npm --prefix client install
```

### 2. Configure Environment Variables

#### Backend (`/server`):
Copy the example environment file:
```bash
cp server/.env.example server/.env
```
Edit `server/.env` with your values:
```env
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:password@direct-host/neondb?sslmode=require"
PORT=4000
NODE_ENV=development
APP_TIMEZONE="Asia/Kolkata"
FRONTEND_ORIGINS="http://localhost:8080,http://localhost:8081,http://localhost:3000"
SESSION_SECRET="your-32-character-or-longer-random-secret-key"
ENABLE_DEMO_CONTENT=true
```

#### Frontend (`/client`):
Copy the example environment file:
```bash
cp client/.env.example client/.env
```
Edit `client/.env`:
```env
VITE_API_BASE_URL="http://localhost:4000/api/v1"
```

### 3. Database Setup & Seeding

Run Prisma migrations and populate initial curriculum worlds, chapters, and missions:

```bash
# Generate Prisma Client
npm run prisma:generate

# Apply migrations
npm run prisma:deploy

# (Optional) Seed demo worlds and missions
npm --prefix server run seed

# (Optional) Create an initial admin account
npm --prefix server run bootstrap:admin -- admin@noorjourney.org "SecureAdminP@ss123"
```

### 4. Run in Development Mode

Run both the server and client concurrently with a single command from the root directory:

```bash
npm run dev
```

- **Client Web App**: [http://localhost:8080](http://localhost:8080) (or port displayed by Vite)
- **Server API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **Swagger Interactive API Docs**: [http://localhost:4000/api/v1/docs](http://localhost:4000/api/v1/docs)
- **Health Probes**: [http://localhost:4000/api/v1/health/live](http://localhost:4000/api/v1/health/live)

### 5. Run with Docker Compose

To launch the full production-ready stack in containers:

```bash
# Provide environment variables in server/.env or export them
docker-compose up --build
```

---

## 🛠️ Monorepo Scripts

The root [`package.json`](file:///package.json) provides convenient scripts to manage both sub-projects:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts both client and server concurrently in development watch mode |
| `npm run dev:server` | Starts NestJS backend with hot-reload on port 4000 |
| `npm run dev:client` | Starts Vite client dev server |
| `npm run build` | Builds both backend (`nest build`) and frontend (`vite build`) |
| `npm run build:server` | Compiles NestJS backend into `/server/dist` |
| `npm run build:client` | Compiles React frontend into `/client/.output/public` |
| `npm run prisma:generate` | Generates TypeScript types from `prisma/schema.prisma` |
| `npm run prisma:deploy` | Executes database migrations against the configured PostgreSQL |
| `npm run start:server` | Runs the compiled backend server in production mode |

---

## 📚 Curriculum & Religious Governance

The pedagogical blueprint of Noor Journey is anchored in authentic Islamic learning adapted for modern digital learners:

1. **Intended SKIMVB Alignment**: Designed around primary Madrasa standards (Class 3–5) in Kerala.
2. **Subject Areas**:
   - **Aqeedah (Faith)**: Pillars of Iman, Tawheed, Allah's Beautiful Names.
   - **Akhlaq (Character)**: Truthfulness, kindness to parents, patience, generosity, environmental stewardship.
   - **Fiqh (Worship)**: Taharah (purity), Wudu steps, daily Salah, respectful etiquette.
   - **Tajweed & Quran**: Makharij (articulation points), basic rules, and Surah Al-Fatihah mastery.
   - **Lisanul-Quran**: Core Quranic Arabic vocabulary.
3. **Four-Eyes Verification**: Content undergoes strict multi-role checks. Unreviewed content is tagged `DEMO_UNREVIEWED` and cannot be published to children without formal religious reviewer sign-off.

For complete pedagogical specifications, read the [Islamic Learning PRD](file:///Islamic_Learning_PRD.md).

---

## 📑 Documentation & Deep Dives

- **[Frontend Client Guide](file:///client/README.md)**: UI architecture, TanStack router paths, component library, games engine, and frontend testing.
- **[Backend Server Guide](file:///server/README.md)**: Module breakdown, database schema, authentication lifecycle, security guards, and full API endpoint catalog.
- **[Production Deployment Guide](file:///DEPLOYMENT.md)**: Step-by-step instructions for deploying to Render, Vercel, and Neon PostgreSQL.
- **[Product Requirements Document](file:///Islamic_Learning_PRD.md)**: Comprehensive curriculum, user persona, and technical specifications.

---

## 🚢 Deployment

The repository includes ready-to-use configurations for:
- **Database**: [Neon](https://neon.tech) serverless PostgreSQL.
- **Backend API**: [Render](https://render.com) using [`render.yaml`](file:///render.yaml) or Railway.
- **Frontend App**: [Vercel](https://vercel.com) using [`client/vercel.json`](file:///client/vercel.json).
- **Self-Hosted**: Multi-container Docker deployment using [`docker-compose.yml`](file:///docker-compose.yml).

Refer to [`DEPLOYMENT.md`](file:///DEPLOYMENT.md) for detailed configuration walkthroughs and deployment checklists.

---

## 🛡️ Ethics & Child Safety

- **Zero Ads & Zero In-App Purchases**: The platform contains no advertising, third-party behavioral trackers, or monetization paywalls targeting children.
- **COPPA & Child Data Privacy**: Passwords are securely hashed with Argon2id; child accounts are kept isolated under parent guardianship.
- **Healthy Screen Time**: Bite-sized missions (5–7 minutes each) promote natural conclusion points without addictive endless scrolling.

---

*Made with dedication for our young learners. May Allah bless this endeavor.* 🌙
