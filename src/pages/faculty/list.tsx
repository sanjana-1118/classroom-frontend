import { Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useGetIdentity } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { BACKEND_BASE_URL } from "@/constants";
import { User } from "@/types";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

const FacultyList = () => {
  const [faculty, setFaculty] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const base = BACKEND_BASE_URL.replace(/\/$/, "");
    fetch(`${base}/faculty?limit=100`, { credentials: "include" })
      .then((r) => r.json())
      .then((payload) => setFaculty(payload.data ?? []))
      .catch(() => setFaculty([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return faculty;
    const q = searchQuery.toLowerCase();
    return faculty.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) ||
        f.email?.toLowerCase().includes(q)
    );
  }, [faculty, searchQuery]);

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Faculty</h1>

      <div className="intro-row">
        <p>Browse all teachers and staff members.</p>
        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 gap-2">
          <p className="text-sm font-medium">No faculty members found</p>
          <p className="text-xs text-muted-foreground">
            {searchQuery ? "Try a different search term." : "No teachers have been added yet."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 hover:bg-accent/5 transition-colors"
            >
              <Avatar className="size-10 shrink-0">
                {member.image && (
                  <AvatarImage src={member.image} alt={member.name} />
                )}
                <AvatarFallback className="text-sm font-medium">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {member.createdAt
                    ? new Date(member.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </span>
                <Badge variant="default" className="capitalize text-xs">
                  Teacher
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </ListView>
  );
};

export default FacultyList;
