# React Dashboard Feature Samples

A collection of React and TypeScript feature excerpts showing task management, task presentation, pagination, and dashboard composition. Each file illustrates a specific responsibility within a larger business application.

## Task Management

**Source:** [TasksManager.tsx](./features/TasksManager.tsx)

Coordinates task-list interactions with Redux state and asynchronous operations. Users can change customer, date, priority, and status filters, select pages, open a create/edit dialog, and confirm deletion.

### Implementation Highlights

- Redux selectors expose tasks, filters, loading states, errors, customers, and total pages.
- A shared filter handler updates the selected filter and resets pagination to the first page.
- A memoized debounce function schedules task fetching after filter or page changes.
- Local React state controls the editor dialog, selected task, deletion confirmation, and current page.
- The deletion handler awaits a dispatched thunk with `unwrap()`, schedules a list refresh after success, and displays success or error notifications.
- The editor dialog requests a fresh list after submission.

**What this demonstrates:** coordinating application state, asynchronous actions, and dialog workflows in a React feature component.

**Excerpt boundary:** the Redux modules, debounce helper, and dialogs are supplied by the surrounding application. Campaign options are currently represented by an empty placeholder list.

## Task List Presentation

**Source:** [TasksTable.tsx](./features/TasksTable.tsx)

Renders tasks through typed props and delegates edit and delete actions to its parent. Separate branches display loading, error, and empty states.

### Implementation Highlights

- Task rows show titles, optional description tooltips, customer names, due dates, priorities, and statuses.
- Edit and delete callbacks keep action handling outside the presentation component.
- A `footerElement` prop allows the parent to supply pagination or another footer.
- Framer Motion provides staggered entrance animations.
- date-fns formats due dates using the Hebrew locale.

**What this demonstrates:** separating presentation from orchestration and composing reusable UI through props and callbacks.

**Excerpt boundary:** domain types, label constants, and shared UI primitives come from the surrounding application.

## Compact Pagination

**Source:** [Pagination.tsx](./features/Pagination.tsx)

A controlled pagination component that receives the current page, total page count, and a selection callback.

### Implementation Highlights

- Combines the first three pages, the current page and its neighbors, and the final two pages.
- Removes duplicates, excludes pages outside the valid range, and sorts the result.
- Inserts ellipses where page ranges have gaps.
- Highlights the current page and hides pagination when there is only one page or no pages.

**What this demonstrates:** deriving a compact navigation model from inputs while leaving page state and data fetching to the parent.

## Dashboard Composition

**Source:** [DashboardHomeClient.tsx](./features/DashboardHomeClient.tsx)

Combines customer search, customer management, and task management in a client-side dashboard with a right-to-left layout.

### Implementation Highlights

- Reads customer filters from Redux and dispatches partial filter updates.
- Debounces customer search and filter updates.
- Passes filter values and callbacks to child components.
- Invokes a dedicated hook for synchronizing customer filters with the URL.

**What this demonstrates:** composing feature components and coordinating shared filters at the dashboard level.

**Excerpt boundary:** customer components and the URL synchronization hook are referenced here; their implementations are outside this collection.

## Technologies Used in the Excerpts

React, TypeScript, React Redux, Tailwind CSS utility classes, shadcn-style UI components, Framer Motion, date-fns, Lucide icons, and Sonner notifications.

## About This Collection

These files are feature excerpts for code review and portfolio presentation. Imports using `@/` refer to modules in their original application. The source retains Hebrew interface text and right-to-left presentation where applicable.

The descriptions are based on source inspection. The excerpts have not been compiled or executed in isolation.

