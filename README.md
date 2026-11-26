# TaskScript | Department Prompt & SOP Launcher

Centralized interactive prompt assembler and standard operating procedure (SOP) quick-launcher for virtual assistants, project managers, and operations teams.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install --legacy-peer-deps
```

### Environment Variables

Copy `.env.example` to `.env` and add your Gemini API key if running the Express server locally:

```bash
cp .env.example .env
```

### Scripts

- `npm run dev` — Start the Express + Vite development server on port `3000`
- `npm run build` — Build the production frontend into `./dist` and bundle `server.ts`
- `npm run start` — Start the production Express server
- `npm run lint` — Run TypeScript type checking (`tsc --noEmit`)

## GitHub Pages Deployment

This repository includes `.github/workflows/deploy.yml`, which automatically builds and deploys `./dist` to GitHub Pages on every push to `main` (and supports manual runs via `workflow_dispatch`):

1. Push the repository to GitHub on the `main` branch.
2. In your GitHub repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. The workflow runs `npm install --legacy-peer-deps`, executes `npm run build`, and deploys `./dist`.
