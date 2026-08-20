import React, { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  BookOpen,
  GraduationCap,
  Users,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Megaphone,
  CalendarDays,
} from "lucide-react";
import { BACKEND_BASE_URL } from "@/constants";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import type { User, Announcement, TimetableClass, Schedule } from "@/types";

/* ─────────────────────────────────────────────
   Shared stat card
───────────────────────────────────────────── */
const StatCard = ({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  isLoading: boolean;
}) => (
  <Card className="dashboard-stat overflow-hidden group border-primary/20">
    <CardContent className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="w-4 h-4 text-primary/80" />
      </div>
      <div>
        {isLoading ? (
          <Skeleton className="h-7 w-16 mt-1" />
        ) : (
          <h2 className="text-3xl font-bold tracking-tight text-primary">{value}</h2>
        )}
      </div>
    </CardContent>
  </Card>
);

/* ─────────────────────────────────────────────
   Staff / Admin dashboard (stats)
───────────────────────────────────────────── */
const StaffDashboard = ({ name, role }: { name: string; role: string }) => {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalClasses: 0,
    totalEnrollments: 0,
    totalStudents: 0,
    totalTeachers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL.replace(/\/$/, "")}/stats`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch stats");
      const json = await response.json();
      setStats(
        json.data ?? {
          totalSubjects: 0,
          totalClasses: 0,
          totalEnrollments: 0,
          totalStudents: 0,
          totalTeachers: 0,
        }
      );
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const firstName = name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const roleLabel = role === "admin" ? "Administrator" : "Teacher";

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-destructive">
              Failed to load statistics
            </h3>
            <p className="text-muted-foreground max-w-sm">
              There was a problem connecting to the server to fetch your dashboard metrics.
            </p>
          </div>
          <Button variant="outline" onClick={fetchStats} className="mt-4 gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting banner */}
      <div className="rounded-xl bg-primary/8 border border-primary/15 px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {greeting}, {firstName} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {roleLabel} · Here's your platform overview for today.
          </p>
        </div>
        <Users className="w-10 h-10 text-primary/30 shrink-0 hidden sm:block" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard title="Subjects" value={stats.totalSubjects} icon={BookOpen} isLoading={isLoading} />
        <StatCard title="Classes" value={stats.totalClasses} icon={GraduationCap} isLoading={isLoading} />
        <StatCard title="Enrollments" value={stats.totalEnrollments} icon={UserCheck} isLoading={isLoading} />
        <StatCard title="Students" value={stats.totalStudents} icon={Users} isLoading={isLoading} />
        <StatCard title="Teachers" value={stats.totalTeachers} icon={Users} isLoading={isLoading} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Student dashboard (my classes + announcements)
───────────────────────────────────────────── */
const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

const StudentDashboard = ({ name }: { name: string }) => {
  const [classes, setClasses] = useState<TimetableClass[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    const base = BACKEND_BASE_URL.replace(/\/$/, "");
    fetch(`${base}/timetable`, { credentials: "include" })
      .then((r) => r.json())
      .then((p) => setClasses(p.data ?? []))
      .finally(() => setLoadingClasses(false));
    fetch(`${base}/announcements?page=1&limit=10`, { credentials: "include" })
      .then((r) => r.json())
      .then((p) => setAnnouncements(p.data ?? []))
      .finally(() => setLoadingAnnouncements(false));
  }, []);

  const schedule = classes
    .flatMap((item) =>
      (item.schedules ?? []).map((s: Schedule) => ({
        ...s,
        className: item.name,
        subject: item.subject?.name,
        teacher: item.teacher?.name,
      }))
    )
    .sort((a, b) => {
      const dayDiff = DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day);
      return dayDiff !== 0 ? dayDiff : a.startTime.localeCompare(b.startTime);
    });

  const firstName = name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-6">

      {/* Greeting banner */}
      <div className="rounded-xl bg-primary/8 border border-primary/15 px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {greeting}, {firstName} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening with your classes today.
          </p>
        </div>
        <GraduationCap className="w-10 h-10 text-primary/30 shrink-0 hidden sm:block" />
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <div>
            {loadingClasses ? (
              <Skeleton className="h-5 w-8 mb-0.5" />
            ) : (
              <p className="text-lg font-bold leading-none">{classes.length}</p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">Enrolled Classes</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          <div>
            {loadingClasses ? (
              <Skeleton className="h-5 w-8 mb-0.5" />
            ) : (
              <p className="text-lg font-bold leading-none">{schedule.length}</p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">Weekly Sessions</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card px-4 py-3 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4 text-primary" />
          </div>
          <div>
            {loadingAnnouncements ? (
              <Skeleton className="h-5 w-8 mb-0.5" />
            ) : (
              <p className="text-lg font-bold leading-none">{announcements.length}</p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">Announcements</p>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-5 lg:grid-cols-5">

        {/* Schedule — wider column */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 px-5 py-4 border-b">
              <CalendarDays className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Weekly Schedule</h3>
              {!loadingClasses && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {schedule.length} session{schedule.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <div className="px-5 py-3">
              {loadingClasses ? (
                <div className="flex flex-col gap-3 py-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              ) : schedule.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <CalendarDays className="w-8 h-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No schedule entries yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 py-2">
                  {schedule.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 text-center shrink-0">
                        <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                          {DAY_SHORT[entry.day] ?? entry.day}
                        </p>
                      </div>
                      <div className="w-px h-7 bg-border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entry.className}</p>
                        <p className="text-xs text-muted-foreground truncate">{entry.subject}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium">{entry.startTime}</p>
                        <p className="text-xs text-muted-foreground">{entry.endTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Announcements — narrower column */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 px-5 py-4 border-b">
              <Megaphone className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Announcements</h3>
              {!loadingAnnouncements && announcements.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {announcements.length}
                </Badge>
              )}
            </div>
            <div className="px-5 py-3">
              {loadingAnnouncements ? (
                <div className="flex flex-col gap-3 py-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
                </div>
              ) : announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Megaphone className="w-8 h-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No announcements yet.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y py-1">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="py-3 first:pt-1 last:pb-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium leading-snug line-clamp-1">{ann.title}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                          {new Date(ann.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {ann.content}
                      </p>
                      {ann.class?.name && (
                        <Badge variant="outline" className="mt-1.5 text-[10px] h-4 px-1.5">
                          {ann.class.name}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Root dashboard — delegates by role
───────────────────────────────────────────── */
const Dashboard = () => {
  const { data: identity, isLoading: identityLoading } = useGetIdentity<User>();

  return (
    <div className="dashboard-shell animate-in fade-in slide-in-from-bottom-4 duration-500">
      {identityLoading ? (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border bg-muted/30 px-6 py-5">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-primary/20">
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-7 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : identity?.role === "student" ? (
        <StudentDashboard name={identity?.name ?? ""} />
      ) : (
        <StaffDashboard name={identity?.name ?? ""} role={identity?.role ?? "teacher"} />
      )}
    </div>
  );
};

export default Dashboard;
