# DevFlow Cloud — Implementation Plan

## Context

Build **DevFlow Cloud**, a production-ready all-in-one developer collaboration platform (inspired by GitHub, Jira, Linear, Slack, Notion, Vercel). This is a greenfield project — the repo has only a README. The plan follows a feature-by-feature approach, ensuring each piece is fully production-ready before moving on.

**Key decision:** Use SQLite via Prisma (not PostgreSQL as originally listed) per user instruction.

---

## Phase 1 — Foundation (Scaffolding, Database, Auth)

### Step 1.1: Project Scaffolding

Initialize the Next.js project with TypeScript, Tailwind, shadcn/ui, pnpm, and all tooling.

**Commands & setup:**
- `pnpm create next-app@latest devflow --typescript --tailwind --eslint --app --src-dir`
- Install shadcn/ui via `pnpm dlx shadcn@latest init`
- Install core deps: `prisma @prisma/client zod react-hook-form @hookform/resolvers next-auth@beta @auth/prisma-adapter zustand @tanstack/react-query socket.io socket.io-client bullmq ioredis recharts @tiptap/react @tiptap/starter-kit @tiptap/mention @tiptap/slash-command`
- Install dev deps: `vitest @playwright/test eslint-config-prettier prettier`

**Config files to create/modify:**
- `tsconfig.json` — strict mode, path aliases (`@/*` -> `src/*`)
- `tailwind.config.ts` — with shadcn/ui theme tokens
- `src/lib/utils.ts` — cn() utility
- `src/config/site.ts` — site metadata
- `.env.example` / `.env` — environment variables
- `.prettierrc` — formatting config

### Step 1.2: Database Schema (Prisma + SQLite)

**File:** `prisma/schema.prisma`

Full normalized schema with all entities:

```
- User (id, name, email, emailVerified, image, password, timezone, locale, twoFactorEnabled, twoFactorSecret, createdAt, updatedAt)
- Account, Session, VerificationToken (Auth.js adapter models)
- Organization (id, name, slug, logo, description, plan, billingEmail, createdAt, updatedAt)
- Team (id, name, description, organizationId -> Organization)
- Membership (id, userId -> User, organizationId -> Organization, roleId -> Role, joinedAt)
- Role (id, name, description, organizationId -> Organization, isSystem)
- Permission (id, action, description, category)
- RolePermission (roleId -> Role, permissionId -> Permission)
- Project (id, name, slug, description, icon, organizationId -> Organization, leadId -> User, startDate, endDate, isArchived, createdAt, updatedAt)
- Sprint (id, title, goal, projectId -> Project, status, startDate, endDate, createdAt)
- Issue (id, title, description, status, priority, type, projectId -> Project, sprintId -> Sprint, reporterId -> User, assigneeId -> User, parentId -> Issue, dueDate, estimate, sortOrder, isArchived, createdAt, updatedAt)
- Comment (id, body, issueId -> Issue, userId -> User, parentId -> Comment, isEdited, createdAt, updatedAt)
- Label (id, name, color, projectId -> Project)
- IssueLabel (issueId -> Issue, labelId -> Label)
- ChecklistItem (id, title, isChecked, issueId -> Issue, sortOrder)
- IssueWatcher (issueId -> Issue, userId -> User)
- Attachment (id, fileName, fileSize, mimeType, url, key, issueId -> Issue, commentId -> Comment, userId -> User, createdAt)
- Document (id, title, content, projectId -> Project, parentId -> Document, userId -> User, isPublished, sortOrder, createdAt, updatedAt)
- Channel (id, name, topic, description, organizationId -> Organization, isPrivate, isDirectMessage, createdAt)
- ChannelMember (channelId -> Channel, userId -> User)
- Message (id, content, channelId -> Channel, userId -> User, parentId -> Message, isEdited, isPinned, createdAt, updatedAt)
- MessageReaction (id, messageId -> Message, userId -> User, emoji)
- Notification (id, type, title, body, userId -> User, organizationId -> Organization, referenceId, referenceType, isRead, createdAt)
- AuditLog (id, action, entityType, entityId, userId -> User, organizationId -> Organization, metadata, ipAddress, createdAt)
- Deployment (id, projectId -> Project, environment, status, commitSha, commitMessage, branch, deployedById -> User, url, logs, startedAt, finishedAt, createdAt)
- ApiKey (id, name, key, organizationId -> Organization, userId -> User, permissions, lastUsedAt, expiresAt, createdAt)
- Webhook (id, url, secret, organizationId -> Organization, events, isActive, lastTriggeredAt, createdAt)
- Invitation (id, email, token, organizationId -> Organization, teamId -> Team, roleId -> Role, invitedById -> User, status, expiresAt, createdAt)
```

Indexes on: foreign keys, lookup fields (slug, email), sort fields (createdAt), status fields.

**Migration & seed:**
- `pnpm dlx prisma migrate dev --name init`
- `prisma/seed.ts` — seed script for default roles, permissions, demo data

### Step 1.3: Authentication System

**Library:** Auth.js v5 with Prisma adapter + SQLite

**Providers to configure:**
- Credentials (email/password with bcrypt)
- Google OAuth
- GitHub OAuth
- Resend (magic link via email)

**Files to create:**
- `src/auth.ts` — main Auth.js config
- `src/auth.config.ts` — edge-compatible auth config
- `src/server/auth.ts` — server-side auth helpers
- `src/app/api/auth/[...nextauth]/route.ts` — catch-all route
- `src/app/(auth)/login/page.tsx` + `login-form.tsx`
- `src/app/(auth)/register/page.tsx` + `register-form.tsx`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/(auth)/verify-email/page.tsx`
- `src/app/(auth)/verify-2fa/page.tsx`
- `src/hooks/use-session.ts` — client session hook
- `src/components/auth/auth-button.tsx` — sign in/out button
- `src/components/auth/auth-guard.tsx` — route protection wrapper

**Key flows:**
- Registration -> email verification -> redirect to org creation
- Login -> optional 2FA challenge -> dashboard
- Magic link -> auto-authenticate -> dashboard
- Forgot password -> email with reset link -> set new password -> login

### Step 1.4: RBAC Authorization

**Files to create:**
- `src/config/permissions.ts` — all permission definitions as const enum
- `src/server/authorization.ts` — checkPermission(), requirePermission() helpers
- `src/app/api/auth/roles/route.ts` — CRUD for roles
- `src/app/api/auth/permissions/route.ts` — list permissions
- `src/components/rbac/permission-guard.tsx` — wrapper component

**Permission categories (granular):**
- `organization.*` — view, edit, delete, transfer
- `project.*` — create, view, edit, delete, archive
- `issue.*` — create, view, edit, delete, assign, close, move
- `comment.*` — create, edit, delete
- `attachment.*` — upload, delete
- `member.*` — invite, remove, manage_roles
- `team.*` — create, edit, delete
- `channel.*` — create, edit, delete
- `billing.*` — view, manage
- `settings.*` — view, manage
- `admin.*` — impersonate, audit_log

**Default roles per organization:** Owner (all), Admin (almost all), Manager (project+issue mgmt), Developer (issue CRUD, comments), Viewer (read-only), Guest (minimal).

### Step 1.5: Organization Management

**Files to create:**
- `src/app/(dashboard)/[orgSlug]/layout.tsx` — org layout with sidebar
- `src/app/(dashboard)/[orgSlug]/page.tsx` — org dashboard
- `src/app/(dashboard)/[orgSlug]/settings/page.tsx` — org settings
- `src/app/(dashboard)/[orgSlug]/members/page.tsx` — member management
- `src/app/(dashboard)/[orgSlug]/teams/page.tsx` — team management
- `src/app/(dashboard)/create-org/page.tsx` — create organization
- `src/components/org/org-switcher.tsx` — org dropdown
- `src/components/org/invite-dialog.tsx` — invite members modal
- `src/app/api/orgs/route.ts` + `[orgId]/route.ts` — org CRUD
- `src/app/api/invitations/route.ts` — accept/reject invitations

### Step 1.6: UI Shell & Navigation

- Responsive sidebar with collapsible sections
- Organization switcher at top
- Notification bell + user menu
- Mobile bottom nav
- Breadcrumb component
- Global layout with auth checks

---

## Phase 2 — Core Features

### Step 2.1: Project Management

**Files to create:**
- `src/app/(dashboard)/[orgSlug]/projects/page.tsx` — project list
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/page.tsx` — project detail
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/settings/page.tsx`
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/board/page.tsx` — Kanban
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/backlog/page.tsx`
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/sprints/page.tsx`
- `src/components/projects/project-card.tsx`
- `src/components/projects/create-project-dialog.tsx`
- `src/components/projects/kanban-board.tsx` — drag-and-drop Kanban
- `src/components/projects/kanban-column.tsx`
- `src/components/projects/sprint-progress.tsx`
- `src/app/api/projects/route.ts`

### Step 2.2: Issue Tracking

**Files to create:**
- `src/features/issues/` — full feature folder:
  - `components/issue-card.tsx`, `issue-detail.tsx`, `issue-form.tsx`
  - `components/issue-comments.tsx`, `issue-checklist.tsx`
  - `components/issue-labels.tsx`, `issue-priority.tsx`
  - `components/issue-watchers.tsx`, `issue-attachments.tsx`
  - `components/issue-sidebar.tsx` — assignee, labels, sprint, due date
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/issues/[issueId]/page.tsx`
- `src/app/api/issues/route.ts` + `[issueId]/route.ts`
- `src/app/api/comments/route.ts` + `[commentId]/route.ts`
- `src/app/api/attachments/route.ts`
- Zustand store for optimistic issue updates: `src/stores/issue-store.ts`
- TanStack Query hooks: `src/hooks/queries/use-issues.ts`

**Key features:** Labels CRUD, priority selector (urgent/high/medium/low), status workflow (backlog/todo/in_progress/review/done/cancelled), assignee autocomplete, watchers, checklists, due dates, activity history timeline.

### Step 2.3: Documentation / Wiki

**Files to create:**
- `src/features/documents/`:
  - `components/editor.tsx` — TipTap editor wrapper
  - `components/editor-extensions.ts` — custom extensions
  - `components/document-tree.tsx` — sidebar tree view
  - `components/document-toolbar.tsx`
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/wiki/page.tsx`
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/wiki/[docId]/page.tsx`
- `src/app/api/documents/route.ts`
- `src/hooks/use-autosave.ts` — debounced autosave every 3s

**Editor features:** Slash commands, @mentions, code blocks with syntax highlighting, tables, images (upload to S3), task lists, headings, formatting toolbar.

### Step 2.4: Real-Time Chat

**Files to create:**
- `src/server/websocket.ts` — Socket.IO server setup
- `src/features/chat/`:
  - `components/chat-sidebar.tsx` — channel list
  - `components/chat-messages.tsx` — virtualized message list
  - `components/chat-input.tsx` — message input with emoji + file upload
  - `components/chat-thread.tsx` — thread view
  - `components/typing-indicator.tsx`
  - `components/presence-indicator.tsx`
  - `components/message-reactions.tsx`
- `src/app/(dashboard)/[orgSlug]/chat/page.tsx`
- `src/app/(dashboard)/[orgSlug]/chat/[channelId]/page.tsx`
- `src/app/api/channels/route.ts`
- `src/app/api/messages/route.ts`
- `src/hooks/use-socket.ts` — Socket.IO client with auto-reconnect + exponential backoff

### Step 2.5: Notifications

**Files to create:**
- `src/server/sse.ts` — SSE endpoint for notification streaming
- `src/features/notifications/`:
  - `components/notification-center.tsx`
  - `components/notification-item.tsx`
  - `components/notification-bell.tsx`
- `src/app/api/notifications/route.ts`
- `src/app/api/notifications/sse/route.ts` — SSE route handler
- `src/hooks/use-notifications.ts` — real-time subscription

**Notification types:** mention, assignment, comment_reply, deployment_status, invitation, role_change, due_date_approaching.

---

## Phase 3 — Advanced Features

### Step 3.1: Dashboard with Streaming Widgets

**Files to create:**
- `src/app/(dashboard)/[orgSlug]/dashboard/page.tsx`
- `src/components/dashboard/`:
  - `widget-recent-projects.tsx` — Suspense-wrapped
  - `widget-assigned-issues.tsx`
  - `widget-sprint-progress.tsx`
  - `widget-team-activity.tsx`
  - `widget-online-members.tsx`
  - `widget-deployments.tsx`
  - `widget-notifications.tsx`
  - `widget-analytics.tsx`
- `src/components/dashboard/dashboard-grid.tsx` — draggable/responsive grid layout

Each widget fetches independently using Suspense boundaries and streaming.

### Step 3.2: Global Search

**Files to create:**
- `src/components/search/command-palette.tsx` — Cmd+K modal
- `src/components/search/search-input.tsx`
- `src/components/search/search-results.tsx`
- `src/app/api/search/route.ts` — unified search endpoint
- `src/hooks/use-debounce.ts`

**Search scope:** projects, users, issues, documents, messages. Results grouped by type with keyboard navigation.

### Step 3.3: File Upload System

**Files to create:**
- `src/lib/upload.ts` — S3 client configuration
- `src/app/api/upload/route.ts` — presigned URL generation
- `src/app/api/upload/chunk/route.ts` — chunked upload support
- `src/components/ui/file-upload.tsx` — drag & drop zone
- `src/components/ui/file-preview.tsx` — preview modal
- `src/hooks/use-upload.ts` — upload progress tracking

Supports: drag & drop, progress bar, image optimization via sharp, chunked uploads for large files, file type validation, size limits.

### Step 3.4: WebSocket Collaboration

Extend the Socket.IO server from Step 2.4 to support:
- Cursor position broadcasting in documents
- Live Kanban card movement
- Real-time issue updates (when someone edits an issue you're viewing)
- Presence across the organization

### Step 3.5: SSE for Background Jobs

**Files to create:**
- `src/lib/queue.ts` — BullMQ queue configuration (using Redis)
- `src/server/background-jobs.ts` — job processors
- `src/app/api/sse/deployments/route.ts` — deployment log streaming
- `src/app/api/sse/import/route.ts`
- `src/app/api/sse/export/route.ts`
- `src/components/deployment/deployment-log-stream.tsx`

Jobs: deployment pipeline, data import/export, AI generation, report generation.

---

## Phase 4 — Production Readiness

### Step 4.1: Deployments

**Files to create:**
- `src/features/deployments/`:
  - `components/deployment-list.tsx`
  - `components/deployment-detail.tsx`
  - `components/deployment-form.tsx`
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/deployments/page.tsx`
- `src/app/(dashboard)/[orgSlug]/projects/[projectSlug]/deployments/[deploymentId]/page.tsx`
- `src/app/api/deployments/route.ts`

### Step 4.2: Analytics & Charts

- Sprint burndown chart (Recharts)
- Team velocity chart
- Issue resolution time
- Deployment frequency
- `src/features/analytics/` folder with chart components

### Step 4.3: Testing

- **Unit tests:** Vitest for all services, server actions, utils
- **Integration tests:** API routes, database operations
- **E2E tests:** Playwright for critical flows (auth, org CRUD, issue CRUD, chat)
- `src/__tests__/` — mirror of src structure for unit tests
- `e2e/` — Playwright tests
- `vitest.config.ts`
- `playwright.config.ts`

### Step 4.4: DevOps

- `docker/Dockerfile` — multi-stage production build
- `docker/Dockerfile.dev` — dev with hot reload
- `docker/docker-compose.yml` — app + Redis + S3-compatible storage
- `.github/workflows/ci.yml` — lint, type-check, test, build
- `.github/workflows/cd.yml` — deploy to Vercel
- `.github/workflows/codeql.yml` — security scanning

### Step 4.5: Security Hardening

- `next.config.js` — CSP headers, security headers
- Rate limiting middleware: `src/middleware.ts`
- Audit logging middleware
- Input sanitization utilities
- SQL injection prevention (Prisma handles this by default)
- XSS protection via output escaping

### Step 4.6: Performance

- `src/components/ui/virtualized-list.tsx` — windowed list (react-window or @tanstack/virtual)
- Infinite scroll for messages, issues, activity
- ISR for public pages
- Streaming with Suspense throughout dashboard
- Dynamic imports for heavy components (editor, charts)
- Image optimization via next/image

### Step 4.7: Accessibility

- Focus management in modals, sheets, dropdowns
- Keyboard navigation (Tab, Enter, Escape, arrow keys)
- ARIA labels on all interactive elements
- Color contrast checking
- Skip-to-content link
- Screen reader announcements for dynamic content

### Step 4.8: Responsive Design

- Mobile: bottom nav, full-width content, collapsible sidebar
- Tablet: condensed sidebar, adjustable columns
- Desktop: full sidebar, multi-column layouts, keyboard shortcuts
- Shared breakpoint utilities in `src/lib/breakpoints.ts`

---

## Build Order & Dependencies

```
Phase 1 (Foundation):
  1.1 Project Scaffolding ────────────── no deps
  1.2 Database Schema ────────────────── depends on 1.1
  1.3 Authentication ─────────────────── depends on 1.2
  1.4 RBAC Authorization ─────────────── depends on 1.2
  1.5 Organization Management ────────── depends on 1.3, 1.4
  1.6 UI Shell ───────────────────────── depends on 1.3, 1.5

Phase 2 (Core Features):
  2.1 Project Management ─────────────── depends on 1.5
  2.2 Issue Tracking ─────────────────── depends on 2.1
  2.3 Documentation / Wiki ───────────── depends on 2.1
  2.4 Real-Time Chat ─────────────────── depends on 1.5
  2.5 Notifications ──────────────────── depends on 1.5, 2.4

Phase 3 (Advanced):
  3.1 Dashboard Streaming ────────────── depends on most of Phase 2
  3.2 Global Search ──────────────────── depends on Phase 2 data
  3.3 File Upload ────────────────────── depends on 2.2
  3.4 WebSocket Collab ───────────────── depends on 2.4
  3.5 SSE Background Jobs ────────────── depends on Phase 2

Phase 4 (Production):
  All depend on Phases 1-3 being complete
```

---

## Verification Plan

After each step, verify with:

1. **Build check:** `pnpm build` — must compile with zero errors (strict TypeScript)
2. **Lint:** `pnpm lint` — zero warnings
3. **Tests:** `pnpm test` — new tests pass
4. **Dev server:** `pnpm dev` — navigate to the feature and verify visually
5. **Accessibility:** Tab through new UI, verify screen reader labels
6. **Responsive:** Check at 375px, 768px, 1024px, 1440px widths
7. **E2E (Phase 4):** `pnpm test:e2e` — critical path tests pass

For database changes:
- `pnpm dlx prisma migrate dev` — confirms migration is valid
- `pnpm dlx prisma studio` — visually inspect data
