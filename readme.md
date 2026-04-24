# /readme

Write a comprehensive README.md for the project. 

## Structure:

### 1. Header
- Project name + one-line description
- Live demo link (Vercel)
- Screenshot/GIF (placeholder if not yet deployed)
- Badges: build status, TypeScript, Next.js version

### 2. Features list
Cover all implemented features from specs/02-features.md

### 3. Tech Stack
List every technology with a one-sentence justification for WHY it was chosen.
This is the most important section for evaluators — explain decisions, not just choices.

Format:
```
- **nuqs** — URL state management. Chosen over useState/Zustand because 
  filter/search/pagination state needs to be shareable via URL and survive 
  page refresh. nuqs integrates with Next.js App Router and provides 
  type-safe query params.
```

### 4. Architecture Overview
- Briefly explain FSD structure
- Explain data flow (URL → TanStack Query → API → zod → component)
- Explain hybrid search/filter strategy (why department filter is client-side)

### 5. Getting Started
```bash
# Prerequisites: Node.js 20+, pnpm 9+

git clone https://github.com/your-username/users-dashboard
cd users-dashboard
pnpm install
pnpm dev
# Open http://localhost:3000
```

### 6. Scripts Reference
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint check |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm test:all` | All checks |

### 7. Project Structure
Brief FSD diagram with explanation of each layer.

### 8. Design Decisions
Address these specific questions:
1. Why Next.js App Router (not Pages Router or Vite)?
2. Why TanStack Query (not SWR or manual fetch)?
3. Why nuqs (not Zustand or React state for URL)?
4. Why hybrid filter strategy (some server-side, some client-side)?
5. Why FSD (not feature folders or atomic design)?

### 9. Trade-offs & Known Limitations
Be honest about what was left out and why. Example:
- E2E tests cover critical paths only (time constraint)
- Dark mode not implemented (out of scope per requirements)
- Department filter is client-side (API limitation — no multi-filter support)

## Tone guidelines:
- Write as a senior engineer explaining to another senior engineer
- Be specific — "I used X because Y" not "I used X"
- Show you thought about alternatives: "I considered X but chose Y because..."
- Keep it concise — the evaluator reads many READMEs
