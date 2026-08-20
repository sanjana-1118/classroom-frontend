import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Schedule, TimetableClass } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TimetablePage = () => {
  const [classes, setClasses] = useState<TimetableClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL.replace(/\/$/, "")}/timetable`, { credentials: "include" })
      .then((response) => response.json())
      .then((payload) => setClasses(payload.data ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  const entries = classes
    .flatMap((item) =>
      (item.schedules ?? []).map((schedule: Schedule) => ({
        ...schedule,
        className: item.name,
        subject: item.subject?.name,
        teacher: item.teacher?.name,
        department: item.department?.name,
      }))
    )
    .sort((a, b) => {
      const dayDiff = DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

  return (
    <ListView>
      <Breadcrumb />
      <div className="flex items-center gap-3 mb-4">
        <CalendarDays className="size-7 text-primary" />
        <div>
          <h1 className="page-title">Timetable</h1>
          <p className="text-muted-foreground">Your class schedule at a glance.</p>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Loading timetable...</p>}
      {!isLoading && entries.length === 0 && (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">No schedule entries found.</p>
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Day</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Time</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Class</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Subject</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={`${entry.className}-${entry.day}-${entry.startTime}-${index}`} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{entry.day}</td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.startTime} – {entry.endTime}</td>
                  <td className="px-4 py-3 font-medium">{entry.className}</td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.subject}</td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ListView>
  );
};

export default TimetablePage;