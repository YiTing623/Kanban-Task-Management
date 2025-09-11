# Kanban Task Management

A small, production-style Kanban built with **Next.js (App Router)**, **TypeScript**, **Tailwind**, **Zustand**, and **dnd-kit**.  
It includes CRUD, drag-and-drop between columns, backlog list, task detail route, filters, persisted preferences, sorting, bulk actions, search highlighting, export/import, and meaningful loading/error states.

---

## Setup Instructions

**Requirements**
- Node 18+ (or 20+ recommended)
- pnpm 9+ (or use npm/yarn — replace commands accordingly)

**Install & run**
```bash
pnpm i
pnpm dev       # http://localhost:3000
```

**Build & start**
```bash
pnpm build
pnpm start
```

**Tests**
```bash
pnpm test              # run
pnpm test -- --coverage
```

---

## Architecture Overview

**Routing (App Router)**
- `/` – **Board**: three columns (**Scheduled / In Progress / Done**), DnD, create task modal.
- `/tasks` – **Backlog** table: filter, sort, bulk actions, export/import.
- `/tasks/[id]` – **Task detail**: full view, inline edit modal, move to next status.
- Route-level `loading.tsx` & `error.tsx`: meaningful skeletons + error boundaries for `/`, `/tasks`, and `/tasks/[id]`.

**State & data flow**
- `src/lib/taskStore.ts` – Zustand store (+ `persist`) as the single source of truth:
  - `tasks`, `filters`, `sort`
  - CRUD (`createTask/updateTask/deleteTask`)
  - Move & reorder (`moveTask`, `moveToStatusAtIndex`, `reorderWithinStatus`)
  - Bulk selection (`selectionMode`, `selected`, `bulkMove`, `bulkDelete`, `selectAll`, `clearSelection`)
  - Persistence to `localStorage` for durable fields; selection state is **ephemeral**.
  - Hydration: on first load, seed with `sampleTasks` and set `_hasHydrated`.

- **Sorting**
  - Sort keys: `manual | created | due | priority | title` with `asc/desc`.
  - When reordering for the first time from a computed sort, `ensureManualBaseline()` freezes the visible order **per column** and switches to `manual` to prevent jumping in other columns.

- **DnD** (`@dnd-kit/core`, `@dnd-kit/sortable`)
  - Pointer + keyboard sensors; `closestCorners` collision.
  - Drag handle on each card; drag is **disabled** while in selection mode.

**UI components**
- `FiltersBar` – search, assignee/tag filters, create & extra actions (bulk/IO).
- `Column` – column header & droppable list of `DraggableTask` items.
- `TaskCard` – single card; supports selection checkbox, drag handle, actions.
- `TaskFormModal` – create/edit with a11y dialog semantics.
- `EmptyState` – consistent empty UI.
- `highlight.tsx` – query highlighter (`<mark>`) for search results.
- `date.ts` – `formatDate`, `isOverdue` helpers.

**Types & sample data**
- `types.ts` – Task/Status/Priority types.
- `sample.ts` – realistic seed data (10–15 tasks across columns).

---

## Key Decisions & Tradeoffs

- **Local state + localStorage** keeps the exercise focused on product/UI while still demonstrating persistence. Export/import supports data round‑trips.
- **Hydration robustness** avoids SSR/CSR mismatches by seeding after hydration and guarding with `_hasHydrated`.
- **Manual vs computed sort**: once the user reorders, the app switches to **manual** per column to respect user intention.
- **Drag handle** reduces accidental drags on mobile/trackpads.
- **Ephemeral selection**: bulk selection isn’t persisted to avoid confusion after reloads.

---

## Accessibility & Performance Notes

- **Modal a11y**: `role="dialog"`, labelled/described, Esc & overlay close, focus trap, return focus to opener.
- **Loading skeletons**: `role="status"`, `aria-live="polite"`, `aria-busy="true"`, and layouts that mirror the final UI (board columns, table rows, detail).
- **Keyboard**: tab order preserved; drag is keyboard-enabled via dnd-kit sensor.
- **Color & tap targets**: status pills and tags meet contrast; touch-friendly spacing.
- **Perf**: small, colocated components; store selectors limit re-renders.

---

## Testing Approach

- **Unit/store tests (Vitest)**
  - CRUD & moves: `create/update/delete`, `moveTask`, `moveToStatusAtIndex`.
  - Reordering: first-drag baseline freeze + up/down reorder within status.
  - Filtering & sorting: `useFilteredTasks` (text + assignee + tag) and sort keys.
  - Date helpers: `formatDate`, `isOverdue`.

- **UI tests (Testing Library)**
  - Modal a11y semantics and normalization of submitted values.
  - Highlighting utility renders `<mark>` for matching tokens (case-insensitive).

**Run**
```bash
pnpm test -- --coverage
```

---

## Time Spent

Estimated: 4 hours

---

## If I Had More Time…

- URL‑synced filters & sort to share views.
- Column customization (add columns / rename / WIP limits).
- Advanced filters (query builder: `tag:design assignee:alex "keyword"`).
- Virtualized backlog for large datasets.
- Server sync (Next API routes, optimistic updates) + user auth.
- Undo/redo for destructive actions.
- Subtle DnD animations and card enter/exit transitions.

---

## Scripts

- `pnpm dev` – start dev server  
- `pnpm build` – production build  
- `pnpm start` – serve production build  
- `pnpm test` – run tests  
- `pnpm test -- --coverage` – with coverage

---

## Quick Demo Guide

- **Create** a task from the Board or Backlog; it appears in **Scheduled** and auto‑scrolls/highlights.
- **Drag** across columns and reorder up/down; after the first drag, order is manual and stable.
- **Filter** by text/assignee/tag; results are **highlighted**.
- **Sort** by created/due/priority/title; reordering switches to manual.
- **Bulk operations**: Select → check a few → Move/Delete → Cancel.
- **Export/Import**: Download JSON, then re‑import to merge/restore.
- **Detail route**: `/tasks/[id]` shows full view and inline edit; move to next status.
- **Loading/Error**: throttle network → skeletons match page type; error boundaries allow recovery.
