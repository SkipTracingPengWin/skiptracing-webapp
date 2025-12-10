# AI Skip Tracing & Loan Recovery System

This is a comprehensive AI-powered Skip Tracing and Loan Recovery platform built with Next.js 14, Tailwind CSS, and TypeScript.

## Features

- **Landing Page**: Premium FinTech hero, features, workflow visualization.
- **Authentication**: Register, Forgot Password, OTP verification.
- **Dashboard**: Stats, charts, alerts, agent status, heatmap preview.
- **Borrowers**: Full CRUD, filters, status/risk badges.
- **Skip Trace Map**: Interactive Leaflet map with probability markers.
- **Agents**: Agent management with status tracking.
- **Assignments**: Case-to-agent assignment with workload view.
- **Recovery Actions**: SMS, calls, visits, legal notices management.
- **Audit Logs**: RBI-compliant immutable logs with export.
- **Reports**: Charts and analytics.

## Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm

## Getting Started

### 1. Install Dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your credentials:

```bash
cp .env.example .env.local
```

You will need to configure:
- Database URL (if using a database)
- NextAuth secret and providers
- API keys for Signzy, Maps, etc.

### 3. Run the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows a feature-based structure:

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components and feature-specific components.
- `src/entities`: TypeScript interfaces and Zod schemas.
- `src/lib`: Utility functions and core logic (e.g., skip tracing algorithms).
- `src/hooks`: Custom React hooks.
- `src/store`: State management (Zustand/Context).
- `src/services`: API service layers.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)
