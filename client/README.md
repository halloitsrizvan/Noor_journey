# 🎨 Noor Journey — Web Client

> **Interactive, kid-friendly React 19 frontend for the Noor Journey Islamic learning platform.**  
> Built with modern web standards: TanStack Start & Router, Vite, Tailwind CSS v4, Radix UI, Canvas 2D games engine, and Web Audio API.

---

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)
[![TanStack](https://img.shields.io/badge/TanStack-Router%20%26%20Start-orange.svg)](https://tanstack.com/router)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.x-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.x-729B1B.svg)](https://vitest.dev/)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features & Screens](#-key-features--screens)
  - [Adventure Journey Map](#1-adventure-journey-map-journey)
  - [Mission Player & Checkpoints](#2-mission-player--checkpoints)
  - [Surah Al-Fatihah & Tajweed Studio](#3-surah-al-fatihah--tajweed-studio-tajweed)
  - [Islamic Games Hub & Noor Dino Runner](#4-islamic-games-hub--noor-dino-runner-games)
  - [Madrasa Curriculum Explorer](#5-madrasa-curriculum-explorer-curriculum)
  - [Parent Dashboard & Family Reflections](#6-parent-dashboard--family-reflections-parent)
  - [Editorial & Admin Portal](#7-editorial--admin-portal-admin)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Installation & Local Run](#installation--local-run)
- [Available Scripts](#-available-scripts)
- [Testing & Quality](#-testing--quality)
- [Containerization & Deployment](#-containerization--deployment)

---

## 🌟 Overview

The **Noor Journey Client** is an engaging, mobile-first web application designed for children aged 9–12. It delivers a joyful, distraction-free learning experience with rich tactile interactions, animated mascots, audio recitations, and instant encouraging feedback.

Key design principles:
- **Child-Friendly UX**: Large tap targets, high contrast, warm Islamic aesthetic (emerald greens, gold accents, deep purples), and clear visual progress.
- **Bilingual Accessibility**: Full support for Malayalam (മലയാളം), English, and Arabic script rendering.
- **Fast & Responsive**: Optimized for phones, tablets, and desktops using Vite and TanStack Start.
- **Offline & Audio Resilient**: Native HTML5 audio players with fallback support for recitation streams.

---

## 🚀 Key Features & Screens

### 1. Adventure Journey Map (`/journey`)
- Visual roadmap through 5 learning worlds:
  - 🌿 **World 1**: Foundations of Faith (Aqeedah)
  - 🤲 **World 2**: Daily Practice & Prayer (Fiqh)
  - 💎 **World 3**: Beautiful Character & Ethics (Akhlaq)
  - 📜 **World 4**: Quranic Stories & Wisdom
  - 📖 **World 5**: Arabic & Quran Language
- Unlocking mechanics: completed nodes, active missions, and locked milestones with visual indicators.

### 2. Mission Player & Checkpoints
- **Interactive Learning Steps**: Multi-modal activities including single choice, multiple choice, matching pairs, sequence ordering, and reflection prompts.
- **Audio Recitations**: High-quality audio guidance for Duas and verses.
- **Authoritative Checkpoints**: Server-evaluated quizzes requiring 3 out of 4 correct to progress.
- **Celebratory Transitions**: Confetti animations, XP awards, and badge notifications upon passing.

### 3. Surah Al-Fatihah & Tajweed Studio (`/tajweed`)
- **Verse-by-Verse Study**: 7 verses with Arabic text, transliteration, and English/Malayalam translations.
- **Color-Coded Tajweed Rules**: Interactive highlights for Madd, Idgham, Ikhfa, Qalqalah, and Ghunnah with explanatory popups.
- **Multiple Renowned Qaris**: Switch between Mishary Rashid Alafasy, Abdul Basit, Mahmoud Khalil Al-Husary, and other Qaris.
- **Repeat & Loop Tools**: Enables children to listen and practice until pronunciation is confident.

### 4. Islamic Games Hub & Noor Dino Runner (`/games`)
- **Noor Dino Runner**:
  - Built with HTML5 Canvas 2D engine.
  - Obstacle avoidance: jump over thorns and worldly distractions.
  - Collectible Noor lanterns and prayer water buffs for bonus scores.
  - Smooth physics, jump velocity, high score local persistence, and custom audio cues.
- **Trivia & Word Puzzles**: Fast-paced mini-games reinforcing lessons learned on the journey map.

### 5. Madrasa Curriculum Explorer (`/curriculum`, `/subject/:key`)
- Structured breakdown of traditional Madrasa subjects aligned with the Samastha (SKIMVB) standard:
  - **Tajweed**: Articulation points (Makharij) and pronunciation rules.
  - **Fiqh**: Purification (Wudu, Ghusl) and Salah postures.
  - **Aqeedah**: Tawheed and the 6 Articles of Faith.
  - **Akhlaq**: Sunnah etiquette, respecting elders, honesty, and kindness.
  - **Lisanul-Quran**: Quranic vocabulary building.

### 6. Parent Dashboard & Family Reflections (`/parent`)
- **Adult Verification Barrier**: Re-authentication gate prevents accidental child access to settings.
- **Activity & Streak Monitor**: Weekly goal tracking, daily mission history, and XP overview.
- **Family Reflection Prompts**: Post-mission questions enabling parents to engage their children in spiritual discussions.

### 7. Editorial & Admin Portal (`/admin`)
- Review submitted curriculum versions from educational authors.
- Four-eyes sign-off workflow preventing unreviewed content from publishing.
- Student profile management and audit logs.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start) |
| **Routing** | [TanStack Router](https://tanstack.com/router) (file-based routing) |
| **Bundler** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI Primitives](https://www.radix-ui.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **State & Data Fetching** | [TanStack React Query](https://tanstack.com/query) |
| **Game Engine** | HTML5 Canvas 2D + Web Audio API |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Testing** | [Vitest](https://vitest.dev/) + React Testing Library |

---

## 📂 Folder Structure

```text
client/
├── public/                 # Static public assets (icons, sounds, graphics)
├── src/
│   ├── components/         # Modular React components
│   │   ├── admin/          # Editorial & Admin management UI
│   │   ├── auth/           # Login, registration, adult pin dialogs
│   │   ├── collection/     # Badges, trophy shelf, cosmetic unlocks
│   │   ├── common/         # Shared header, navigation, language selector
│   │   ├── curriculum/     # Madrasa subject cards and topic trees
│   │   ├── dashboard/      # Child home dashboard and mission overview
│   │   ├── games/          # NoorDinoRunner canvas game & mini-games
│   │   ├── journey/        # Adventure map canvas & mission step player
│   │   ├── layout/         # Root layouts, drawer menus, bottom nav
│   │   ├── leaderboard/    # Friendly cohort achievements
│   │   ├── mascot/         # Animated Noor guide & encouraging tooltips
│   │   ├── mission/        # Mission activity types (quiz, sort, match)
│   │   ├── parent/         # Parent reports, reflections, screen time
│   │   ├── practice/       # Spaced repetition review session player
│   │   ├── profile/        # Child profile switcher & avatar picker
│   │   └── ui/             # Radix-based buttons, dialogs, tabs, progress bars
│   ├── features/           # Feature slices and business logic
│   ├── hooks/              # Custom React hooks (audio, session, screen time)
│   ├── lib/                # API client, utility functions, sound effects
│   ├── routes/             # TanStack Router route tree
│   │   ├── __root.tsx      # App shell with notifications and providers
│   │   ├── index.tsx       # Landing page & child welcome
│   │   ├── journey.tsx     # Learning journey & mission player
│   │   ├── tajweed.tsx     # Surah Al-Fatihah Tajweed Studio
│   │   ├── games.tsx       # Islamic Games Hub
│   │   ├── curriculum.tsx  # Madrasa subjects overview
│   │   ├── collection.tsx  # Badges & collectibles
│   │   ├── parent.tsx      # Parent monitoring area
│   │   └── admin.tsx       # Content authoring & review portal
│   ├── routeTree.gen.ts    # Auto-generated TanStack route tree
│   ├── styles.css          # Tailwind CSS v4 design tokens and utilities
│   └── start.ts            # TanStack Start entry point
├── Dockerfile              # Multi-stage production Nginx container
├── package.json            # Client dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment rewrite rules
└── vite.config.ts          # Vite configuration with plugins
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm** or **bun**: `npm v10+` or `bun v1.2+`
- Running instance of the **Noor Journey Server** (default on `http://localhost:4000`)

### Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Configure your API endpoint in `.env`:
```env
# URL pointing to your backend API v1 endpoint (no trailing slash)
VITE_API_BASE_URL="http://localhost:4000/api/v1"
```

### Installation & Local Run

```bash
# 1. Install dependencies
npm install
# or with bun
bun install

# 2. Start the Vite development server
npm run dev
# or with bun
bun dev
```

The application will launch at [http://localhost:8080](http://localhost:8080) (or the port specified in terminal output).

---

## 🛠️ Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with hot-module reloading |
| `npm run build` | Compiles the production bundle into `.output/public` |
| `npm run build:dev` | Compiles the app with development sourcemaps |
| `npm run preview` | Locally serves the compiled production build |
| `npm run test` | Runs the Vitest automated test suite |
| `npm run test:watch` | Runs tests in interactive watch mode |
| `npm run lint` | Runs ESLint to identify code style and syntax issues |
| `npm run format` | Runs Prettier to auto-format source files |

---

## 🧪 Testing & Quality

Run the component and logic unit tests with:
```bash
npm run test
```

Unit tests cover:
- Activity interaction handlers (multiple choice, ordering, match pairs).
- Score calculation and checkpoint finalization state.
- Tajweed audio player state management.
- Parent gate authentication validation.

---

## 🐳 Containerization & Deployment

### Docker (Production Nginx)

The client includes a multi-stage `Dockerfile` that builds static assets and serves them via an optimized Nginx web server:

```bash
# Build the Docker image
docker build -t noor-journey-client .

# Run the container
docker run -p 80:80 -e VITE_API_BASE_URL="https://api.yourdomain.com/api/v1" noor-journey-client
```

### Deploying to Vercel

1. Push the code to your Git provider (GitHub / GitLab).
2. Create a new project on [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Build Command: `npm run build`
5. Output Directory: `.output/public`
6. Add the Environment Variable `VITE_API_BASE_URL` pointing to your deployed backend.

The included [`vercel.json`](file:///client/vercel.json) automatically handles client-side SPA routing rewrites.

---

*Joyful learning, rooted in values.* 🌙
