# Classroom — Frontend

React SPA dashboard for the Classroom Management platform, built with Vite and the Refine admin framework.

## Tech Stack

- **React 19** — UI rendering
- **TypeScript 7** — static typing
- **Vite 6** — build tool and dev server
- **Refine v5** — handles data fetching, CRUD lifecycle, notifications, and URL sync
- **React Router 7** — client-side routing
- **Tailwind CSS 4** — utility-first styling
- **shadcn/ui** — accessible component library built on Radix UI
- **TanStack Table** — headless table state (sorting, pagination, column sizing)
- **React Hook Form + Zod** — form state management and schema validation
- **Cloudinary** — class banner and profile photo uploads
- **Sonner** — toast notifications
- **Recharts** — chart components
- **next-themes** — light/dark theme support
- **Lucide React** — icons

## Project Structure

```
src/
├── components/
│   ├── refine-ui/      Layout, view shells, action buttons, data table wrappers
│   ├── ui/             40+ shadcn/ui primitives
│   ├── schedule-table  Inline weekly schedule editor used in class forms
│   └── upload-widget   Cloudinary upload widget wrapper
├── constants/          BACKEND_BASE_URL, role enums, Cloudinary config keys
├── hooks/              use-mobile breakpoint hook
├── lib/
│   ├── cloudinary.ts   Image URL transformation helpers
│   ├── schema.ts       Zod schemas for all forms
│   └── utils.ts        cn() utility (clsx + tailwind-merge)
├── pages/
│   ├── auth/           login, register
│   ├── classes/        list, create, edit, show
│   ├── departments/    list, create, edit
│   ├── enrollments/    list
│   ├── faculty/        list
│   ├── subjects/       list, create, edit
│   ├── users/          list, edit
│   ├── announcements.tsx
│   ├── dashboard.tsx
│   └── timetable.tsx
├── providers/
│   ├── auth.ts         Refine authProvider (login, logout, check, getIdentity)
│   └── data.ts         Refine dataProvider (maps queries to backend params)
├── types/              Shared TypeScript types
└── App.tsx             Resource definitions and route tree
```

## How Refine Works Here

Refine sits on top of React and manages the repetitive parts of a data-heavy dashboard — fetching, caching, pagination, mutation lifecycle, and notifications. It is headless, so all UI uses shadcn/ui and Tailwind.

The `dataProvider` in `src/providers/data.ts` is the bridge between Refine's internal state and the Express backend. It translates Refine's filter and pagination objects into the URL query params the backend expects (`?search=`, `?page=`, `?limit=`, `?role=`, etc.) and maps the `{ data, pagination }` response envelope back into what Refine understands.

The `authProvider` in `src/providers/auth.ts` wraps Better Auth's cookie-based session endpoints. Refine calls `check()` on every navigation to verify the session is still valid, and `getIdentity()` to get the current user's role, which drives the role-based UI throughout the app.

## Pages

- **Dashboard** — staff see aggregate stats (subjects, classes, enrollments, students, teachers). Students see their enrolled class count, upcoming schedule, and latest announcements.
- **Classes** — searchable and filterable list. Students see enrolled classes only. Teachers see their own classes only. Admins see all.
- **Class Detail** — full class info including banner, teacher, department, subject, capacity, and an enrolled students table with add/remove.
- **Departments** — full CRUD for admin and teacher.
- **Subjects** — full CRUD with department filter.
- **Enrollments** — enrollment list scoped by role. Admin and teacher can remove enrollments. Students see their own.
- **Faculty** — teacher directory with avatar, email, and join date.
- **Users** — admin-only full user directory with role filter and search.
- **Announcements** — class announcement feed. Teachers and admins can post, edit, and delete. Students are read-only. Latest announcements also scroll in a ticker at the top of every page.
- **Timetable** — weekly schedule sorted by day and time, scoped to the current user's classes.

## Role-Based Access

There are three roles: `admin`, `teacher`, and `student`.

Students can only see classes they are enrolled in, their own enrollments, announcements for those classes, and their timetable. They cannot access departments, subjects, faculty, or users.

Teachers can see and manage their own classes, post announcements, manage enrollments in their classes, and browse the faculty directory. They cannot access the full users directory.

Admins have full access to everything.

Route guards in `App.tsx` (`ProtectedRoutes`, `StaffRoutes`, `AdminRoutes`) enforce this at the routing level. The sidebar filters items by role. Individual pages also adjust their content and actions based on the current user's role.

## Environment Variables

Create a `.env` file in the `classroom-frontend/` directory:

```
VITE_BACKEND_BASE_URL             Full URL to the backend API including /api
VITE_CLOUDINARY_CLOUD_NAME        Your Cloudinary cloud name
VITE_CLOUDINARY_UPLOAD_PRESET     Unsigned upload preset name
VITE_CLOUDINARY_UPLOAD_URL        Cloudinary upload endpoint
```

For local development set `VITE_BACKEND_BASE_URL=http://localhost:8080/api`.

## Scripts

```bash
npm run dev      # Start Vite dev server on port 5173
npm run build    # Production build to dist/
npm run start    # Serve the production build locally
```
