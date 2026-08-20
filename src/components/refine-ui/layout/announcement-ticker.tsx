import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { BACKEND_BASE_URL } from "@/constants";
import { Announcement } from "@/types";

export const AnnouncementTicker = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL.replace(/\/$/, "")}/announcements?page=1&limit=5`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setAnnouncements(data.data);
        }
      })
      .catch((err) => console.error("Ticker fetch error", err));
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3 shadow-sm">
        {/* Highlighted icon badge */}
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 shrink-0">
          <Megaphone className="w-5 h-5 text-primary" />
        </div>

        <div className="h-6 w-px bg-primary/20 shrink-0" />

        {/* Scrolling content */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {announcements.map((ann) => (
              <div key={ann.id} className="flex items-center mx-10 gap-2">
                <span className="font-semibold text-sm text-foreground">{ann.title}</span>
                <span className="text-sm text-muted-foreground">—</span>
                <span className="text-sm text-muted-foreground max-w-[250px] sm:max-w-[450px] truncate">{ann.content}</span>
                <span className="text-xs font-medium text-primary/70 bg-primary/10 rounded-full px-2 py-0.5 ml-1">{ann.class?.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
