# 🚀 Noor Journey - Production Deployment Guide

This guide covers how to deploy the **Noor Journey** full-stack Islamic Learning Platform (NestJS Backend + React/Vite Frontend + Neon PostgreSQL).
 
 
---

## 🏗️ Architecture Overview

- **Frontend (`/client`)**: React 19 + TanStack Start / Vite, responsive kid-friendly UI.
- **Backend (`/server`)**: NestJS 11 + Prisma ORM + Swagger Docs (`/api/v1/docs`).
- **Database**: PostgreSQL (Neon Serverless PostgreSQL recommended).

---

## 🌟 Option A: Modern Cloud Hosting (Recommended & Easiest)

### Step 1: Database (Neon PostgreSQL)
1. Go to [neon.tech](https://neon.tech) and create a free PostgreSQL project (e.g. `noor-journey-db`).
2. Copy the two connection strings from the Neon Console:
   - **Pooled connection string**: Use for `DATABASE_URL`
   - **Direct connection string**: Use for `DATABASE_URL_UNPOOLED` (needed for Prisma migrations)

---

### Step 2: Deploy Backend to Render (or Railway)

#### Using Render:
1. Push this code to your GitHub/GitLab repository.
2. Sign in to [render.com](https://render.com) and click **New +** → **Blueprint**.
3. Select your repository. Render will automatically detect [`render.yaml`](file:///render.yaml).
4. Or create a **New Web Service**:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Health Check Path**: `/api/v1/health`
5. Configure Environment Variables in Render:
   | Variable | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Port assigned by Render |
   | `DATABASE_URL` | `postgresql://...pooler...` | Neon pooled connection string |
   | `DATABASE_URL_UNPOOLED` | `postgresql://...direct...` | Neon direct connection string |
   | `FRONTEND_ORIGINS` | `https://your-frontend.vercel.app` | URL of your deployed frontend (no trailing slash) |
   | `SESSION_SECRET` | *(Random 32+ char string)* | Secure session encryption key |
   | `APP_TIMEZONE` | `Asia/Kolkata` | Application timezone |
6. Click **Deploy**. Once built, note your backend URL (e.g., `https://noor-journey-server.onrender.com`).

---

### Step 3: Deploy Frontend to Vercel (or Netlify / Render)

#### Using Vercel:
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. In **Root Directory**, click edit and select `client`.
4. Framework Preset: **Vite** (detected automatically).
5. Build and Output Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`
6. Under **Environment Variables**, add:
   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://noor-journey-server.onrender.com/api/v1` |
7. Click **Deploy**.
8. Once deployed, copy your Vercel URL (e.g., `https://noor-journey.vercel.app`) and update `FRONTEND_ORIGINS` in your backend environment variables so cookies and CORS function properly!

---

## 🐳 Option B: Docker / VPS Deployment (DigitalOcean, Hetzner, AWS EC2)

If deploying to an Ubuntu or Linux VPS with Docker installed:

1. Clone the repository on your server:
   ```bash
   git clone <your-repo-url>
   cd Noor_journey
   ```
2. Create `server/.env` with your Neon database credentials and session secret:
   ```bash
   cp server/.env.example server/.env
   nano server/.env
   ```
3. Start the entire application using Docker Compose:
   ```bash
   docker compose up -d --build
   ```
4. Verify containers are running:
   ```bash
   docker compose ps
   ```
   - Frontend is accessible on port `80` (or behind Nginx SSL on `443`).
   - Backend API is running on port `4000`.

---

## 🔑 Production Database Migration & Admin Bootstrap

Once the backend is connected to your production database, run migrations and seed data:

1. **Run Migrations on Production Database**:
   ```bash
   cd server
   npx prisma migrate deploy
   ```
2. **Seed Dynamic Madrasa Subjects & Curriculum**:
   ```bash
   npm run seed
   ```
3. **Bootstrap Initial Administrator**:
   ```bash
   npm run bootstrap:admin
   ```

---

## ✅ Deployment Checklist

- [x] Backend builds cleanly (`nest build` exits with code 0).
- [x] Frontend builds cleanly (`vite build` exits with code 0).
- [x] API health check endpoint `/api/v1/health` active.
- [x] CORS origins configured via `FRONTEND_ORIGINS`.
- [x] `client/vercel.json` configured for SPA routing.
- [x] `render.yaml` blueprint ready for 1-click cloud deployment.
- [x] Multi-stage `Dockerfile` created for both server and client.
- [x] Root `package.json` with orchestration scripts configured.
