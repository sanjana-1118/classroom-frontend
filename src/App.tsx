import React from "react";
import { Refine, useGetIdentity, useIsAuthenticated } from "@refinedev/core";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { BookOpen, GraduationCap, Home, Users, Building2, Megaphone, CalendarDays, Loader2, UserCheck, School } from "lucide-react";
import SubjectsList from "./pages/subjects/list";
import UsersList from "./pages/users/list";
import UsersEdit from "./pages/users/edit";
import DepartmentListPage from "./pages/departments/list";
import DepartmentCreate from "./pages/departments/create";
import DepartmentEdit from "./pages/departments/edit";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsCreate from "./pages/subjects/create";
import Dashboard from "./pages/dashboard";

import { dataProvider } from "./providers/data";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";
import ClassesEdit from "./pages/classes/edit";
import SubjectsEdit from "./pages/subjects/edit";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import { authProvider } from "./providers/auth";
import type { User } from "./types";
import AnnouncementsPage from "./pages/announcements";
import TimetablePage from "./pages/timetable";
import EnrollmentsList from "./pages/enrollments/list";
import FacultyList from "./pages/faculty/list";

function ProtectedRoutes() {
  const { data, isLoading } = useIsAuthenticated();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!data?.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AdminRoutes() {
  const { data: identity, isLoading } = useGetIdentity<User>();

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (identity?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}

function StaffRoutes() {
  const { data: identity, isLoading } = useGetIdentity<User>();

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (identity?.role !== "admin" && identity?.role !== "teacher") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                title: {
                  icon: <img src="/logo.jpg" alt="Classroom Logo" className="w-8 h-8 rounded-md" />,
                  text: "Classroom",
                }
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/dashboard",
                  meta: {
                    label: "Home",
                    icon: <Home />,
                  },
                },
                {
                  name: "departments",
                  list: "/departments",
                  create: "/departments/create",
                  edit: "/departments/edit/:id",
                  meta: {
                    label: "Departments",
                    icon: <Building2 />,
                  },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  edit: "/subjects/edit/:id",
                  meta: {
                    label: "Subjects",
                    icon: <BookOpen />,
                  },
                },
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  edit: "/classes/edit/:id",
                  show: "/classes/show/:id",
                  meta: {
                    label: "Classes",
                    icon: <GraduationCap />,
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  edit: "/users/edit/:id",
                  meta: {
                    label: "Users",
                    icon: <Users />,
                  },
                },
                {
                  name: "enrollments",
                  list: "/enrollments",
                  meta: {
                    label: "Enrollments",
                    icon: <UserCheck />,
                  },
                },
                {
                  name: "faculty",
                  list: "/faculty",
                  meta: {
                    label: "Faculty",
                    icon: <School />,
                  },
                },
                { name: "announcements", list: "/announcements", meta: { label: "Announcements", icon: <Megaphone /> } },
                { name: "timetable", list: "/timetable", meta: { label: "Timetable", icon: <CalendarDays /> } },
              ]}
            >
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoutes />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  <Route element={<StaffRoutes />}>

                    <Route path="departments">
                      <Route index element={<DepartmentListPage />} />
                      <Route path="create" element={<DepartmentCreate />} />
                      <Route path="edit/:id" element={<DepartmentEdit />} />
                    </Route>

                    <Route path="subjects">
                      <Route index element={<SubjectsList />} />
                      <Route path="create" element={<SubjectsCreate />} />
                      <Route path="edit/:id" element={<SubjectsEdit />} />
                    </Route>
                  </Route>

                  <Route path="classes">
                    <Route index element={<ClassesList />} />
                    <Route element={<StaffRoutes />}>
                      <Route path="create" element={<ClassesCreate />} />
                      <Route path="edit/:id" element={<ClassesEdit />} />
                    </Route>
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>

                  <Route path="announcements" element={<AnnouncementsPage />} />
                  <Route path="timetable" element={<TimetablePage />} />
                  <Route path="enrollments" element={<EnrollmentsList />} />
                  <Route element={<StaffRoutes />}>
                    <Route path="faculty" element={<FacultyList />} />
                  </Route>

                  <Route element={<AdminRoutes />}>
                    <Route path="users">
                      <Route index element={<UsersList />} />
                      <Route path="edit/:id" element={<UsersEdit />} />
                    </Route>
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <Toaster />
              <UnsavedChangesNotifier />
            </Refine>
        </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;