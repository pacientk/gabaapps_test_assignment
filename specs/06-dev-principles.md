# 06 — Development Principles

These principles complement the architecture defined in `01-architecture.md` and the
constraints in `CLAUDE.md`. They apply to all code written in this project.

---

## 1. SOLID

| Principle | Rule |
|-----------|------|
| **S — Single Responsibility** | One component / hook / function = one task. If you need the word "and" — split it |
| **O — Open/Closed** | Extend via composition, not by modifying existing code |
| **L — Liskov Substitution** | Subtypes must be substitutable for their base types without breaking callers |
| **I — Interface Segregation** | Types and interfaces in separate declarations only. Never inline in props/params |
| **D — Dependency Inversion** | Depend on abstractions (interfaces), not implementations. Dependency injection, not manual instantiation |

---

## 2. Code Quality

### Universal

- **DRY** — three similar lines = a pattern; extract to a helper
- **Guard clauses** — early return instead of nested if/else
- **No dead code** — delete commented-out code, unused imports, unused variables
- **Naming** — no `tmp`, `data2`, `res2`. Name must convey intent
- **Lean try-catch** — do not wrap code that cannot throw

### Frontend (React / Next.js)

- Component > 150 lines → split into sub-components
- Reusable UI primitives → `src/shared/ui/` (per FSD structure)
- Repeated hook logic → extract to a custom hook in the relevant `features/*/model/` or `entities/*/model/` layer (per FSD import rules)
- `'use client'` only when truly needed: browser API, event handlers, state
- `useCallback` / `useMemo` only with a proven render performance problem
- Repeated Tailwind class combinations → extract to a component or `cn()` helper

---

## 3. TypeScript

- Never `any` — use `unknown` + type narrowing (enforced by `strict: true`)
- Explicit return types on all exported functions
- Typed errors — no untyped `throw`
- Every `async` function must handle errors explicitly

### File Naming

| Type | Convention |
|------|------------|
| Components | `PascalCase.tsx` |
| Hooks | `useCase.ts` (camelCase) |
| Utilities | `kebab-case.ts` |
| Types | `types.ts` inside the slice/module |
| DTOs | `dto/` directory, never inline |

---

## 4. Git

### Branch naming
```
{type}/{task-id}-{short-description}

feature/42-user-drawer
fix/pagination-reset
chore/update-deps
```

### Commit format
Follows the project convention from `CLAUDE.md`:
```
{type}({scope}): {description} [AC-XXX..AC-XXX]

feat(users-list): add virtualized table with pagination [AC-001..AC-005]
fix(filters): reset pagination on filter change [AC-008]
chore: add vitest config
```

### Hard rules
- Never work directly on `main` / `master`
- One logical change = one commit
- Message describes WHAT and WHY, not HOW

---

## 5. Pre-PR Workflow

Run in this exact order before every PR:

1. **`/optimize`** — SOLID/DRY checklist on changed files
2. **`/review`** — typecheck, lint, tests, ADR compliance
3. Commit + PR

> `/optimize` without `/review` is insufficient. Both must pass.

Both steps are defined and combined in `.claude/commands/review.md`.

---

## 6. Architecture Decisions

| What | Where |
|------|-------|
| Any non-trivial implementation decision | `.context/memory_bank/decisions.md` |
| Architectural decision (new dependency, structural change, new layer) | `.ai/adr/NNN-title.md` |
| Blocked on something | `.context/blockers.md` |

### Blocker format
```
[BLOCKER] <date> | users-dashboard | <description> | <what's needed>
```

**Rule**: If blocked — stop. Do not guess. Do not continue without context.
