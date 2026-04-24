# 00 — Project Overview

## Goal
Build a production-quality Users Dashboard that demonstrates senior-level React/Next.js engineering.
The evaluator is looking at: architecture decisions, code quality, UX polish, and README quality.

## Design Philosophy
- **Data-dense but readable**: show maximum useful info without overwhelming
- **Instant feedback**: every interaction responds in < 100ms (optimistic UI, skeletons)
- **Shareable state**: every filter/sort/search/page/open-drawer is in the URL
- **Accessible**: keyboard navigation, screen reader support, focus management

## What We're Building
A dashboard with three main surfaces:

### 1. Users List (main page `/users`)
Grid/table of user cards with live search, multi-filter, sort, pagination.
Each card shows: avatar, name, role badge, department, company, email, location.

### 2. User Detail Drawer (slide-in panel)
Opens on card click. Shows full user profile across tabs:
- **Profile**: personal info, contact, physical stats
- **Work**: company, department, title, work address
- **Finance**: bank card (masked), currency, IBAN (masked)
- **Crypto**: coin, wallet (truncated), network

### 3. Stats Bar (top of page)
Aggregate stats computed from all 208 users:
- Total users count
- Gender distribution (M/F ratio)
- Top 3 departments
- Average age

## Out of Scope (explicitly)
- Authentication (login page)
- Create/Edit/Delete user (API is fake — simulate only if time permits)
- Real-time updates / WebSockets
- Dark mode (nice-to-have, not required)

## Success Criteria
1. Recruiter opens the app → immediately understands what it does
2. Developer reads the code → sees clear architecture and patterns
3. README explains WHY decisions were made, not just what was built
4. All features work end-to-end with no console errors

## Timeline (3 days)
- **Day 1**: Setup, architecture, users list with pagination
- **Day 2**: Search + filters + sort + user detail drawer
- **Day 3**: Stats bar, polish, tests, README, screenshots
