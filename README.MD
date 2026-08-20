

# 🎨 Classroom — Frontend

The **Classroom Frontend** is a React single‑page application (SPA) that provides the dashboard interface for the Classroom Management platform. It is built with **Vite** for fast development and leverages the **Refine** admin framework to handle data‑heavy workflows such as CRUD operations, pagination, and notifications.



## ⚙️ Tech Stack

- **React 19** — UI rendering  
- **TypeScript 7** — static typing  
- **Vite 6** — build tool + dev server  
- **Refine v5** — data fetching, CRUD lifecycle, notifications, URL sync  
- **React Router 7** — client‑side routing  
- **Tailwind CSS 4** — utility‑first styling  
- **shadcn/ui** — accessible component library (Radix UI based)  
- **TanStack Table** — headless table state (sorting, pagination, sizing)  
- **React Hook Form + Zod** — form state + schema validation  
- **Cloudinary** — image uploads (class banners, profile photos)  
- **Sonner** — toast notifications  
- **Recharts** — chart components  
- **next‑themes** — light/dark theme support  
- **Lucide React** — icons  



## 📂 Project Structure

```
src/
├── components/
│   ├── refine-ui/      Layouts, shells, action buttons, table wrappers
│   ├── ui/             40+ shadcn/ui primitives
│   ├── schedule-table  Inline weekly schedule editor for class forms
│   └── upload-widget   Cloudinary upload widget wrapper
├── constants/          Backend URL, role enums, Cloudinary config
├── hooks/              Custom hooks (e.g., use-mobile breakpoint)
├── lib/
│   ├── cloudinary.ts   Image transformation helpers
│   ├── schema.ts       Zod schemas for forms
│   └── utils.ts        cn() utility (clsx + tailwind-merge)
├── pages/
│   ├── auth/           Login, register
│   ├── classes/        List, create, edit, show
│   ├── departments/    List, create, edit
│   ├── enrollments/    List
│   ├── faculty/        Directory
│   ├── subjects/       List, create, edit
│   ├── users/          List, edit
│   ├── announcements.tsx
│   ├── dashboard.tsx
│   └── timetable.tsx
├── providers/
│   ├── auth.ts         Refine authProvider (login, logout, check, identity)
│   └── data.ts         Refine dataProvider (maps queries to backend params)
├── types/              Shared TypeScript types
└── App.tsx             Resource definitions + route tree
```



## 🔧 How Refine Works Here

Refine abstracts repetitive dashboard logic — fetching, caching, pagination, mutation lifecycle, and notifications — while remaining headless. All UI is built with **shadcn/ui** and **Tailwind**.

- **Data Provider (`src/providers/data.ts`)**  
  Bridges Refine’s state with the Express backend. Translates filters/pagination into backend query params (`?search=`, `?page=`, `?limit=`, `?role=`) and maps responses back into Refine’s format.  

- **Auth Provider (`src/providers/auth.ts`)**  
  Wraps Better Auth’s cookie‑based session endpoints. Refine calls `check()` on navigation to validate sessions and `getIdentity()` to fetch the current user’s role, driving role‑based UI across the app.  



## 📑 Pages

- **Dashboard** — Staff see aggregate stats (subjects, classes, enrollments, users). Students see enrolled class count, upcoming schedule, and announcements.  
- **Classes** — Searchable list. Students see enrolled classes only; teachers see their own; admins see all.  
- **Class Detail** — Banner, teacher, department, subject, capacity, enrolled students table with add/remove.  
- **Departments** — Full CRUD (admin/teacher).  
- **Subjects** — Full CRUD with department filter.  
- **Enrollments** — Role‑scoped list. Admin/teacher can remove; students see their own.  
- **Faculty** — Teacher directory with avatar, email, join date.  
- **Users** — Admin‑only full directory with role filter + search.  
- **Announcements** — Feed of class announcements. Teachers/admins can post/edit/delete; students read‑only. Latest announcements also scroll in a ticker.  
- **Timetable** — Weekly schedule sorted by day/time, scoped to user’s classes.  



## 🔑 Role-Based Access

Roles: `admin`, `teacher`, `student`  

- **Students** — Enrolled classes, own enrollments, announcements, timetable. No access to departments, subjects, faculty, or users.  
- **Teachers** — Manage their classes, post announcements, manage enrollments, browse faculty. No access to full users directory.  
- **Admins** — Full access to all resources.  

Route guards in `App.tsx` (`ProtectedRoutes`, `StaffRoutes`, `AdminRoutes`) enforce access. Sidebar items and page content/actions adjust dynamically based on role.  



## ⚙️ Environment Variables

Create a `.env` file in `classroom-frontend/`:

```
VITE_BACKEND_BASE_URL             Full backend API URL (include /api)
VITE_CLOUDINARY_CLOUD_NAME        Cloudinary cloud name
VITE_CLOUDINARY_UPLOAD_PRESET     Unsigned upload preset
VITE_CLOUDINARY_UPLOAD_URL        Cloudinary upload endpoint
```

For local dev:  
```
VITE_BACKEND_BASE_URL=http://localhost:8080/api
```



## 📜 Scripts

```bash
npm run dev      # Start Vite dev server (port 5173)
npm run build    # Production build to dist/
npm run start    # Serve production build locally
```

