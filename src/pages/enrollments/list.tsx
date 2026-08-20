import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useGetIdentity } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { User } from "@/types";

type EnrollmentListItem = {
  id: number;
  classId: number;
  studentId: string;
  createdAt: string;
  class: {
    id: number;
    name: string;
    status: string;
    inviteCode?: string;
  } | null;
  student: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
  } | null;
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

const EnrollmentsList = () => {
  const { data: identity } = useGetIdentity<User>();
  const canDelete = identity?.role === "admin" || identity?.role === "teacher";
  const [searchQuery, setSearchQuery] = useState("");

  const enrollmentColumns = useMemo<ColumnDef<EnrollmentListItem>[]>(
    () => [
      {
        id: "student",
        accessorKey: "student.name",
        size: 240,
        header: () => <p className="column-title">Student</p>,
        cell: ({ row }) => {
          const student = row.original.student;
          if (!student) return <span className="text-muted-foreground">—</span>;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="size-8 shrink-0">
                {student.image && (
                  <AvatarImage src={student.image} alt={student.name} />
                )}
                <AvatarFallback className="text-xs">
                  {getInitials(student.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="font-medium truncate">{student.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {student.email}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "class",
        accessorKey: "class.name",
        size: 220,
        header: () => <p className="column-title">Class</p>,
        cell: ({ row }) => {
          const cls = row.original.class;
          if (!cls) return <span className="text-muted-foreground">—</span>;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium truncate">{cls.name}</span>
              {cls.inviteCode && (
                <span className="text-xs text-muted-foreground font-mono">
                  #{cls.inviteCode}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "classStatus",
        accessorKey: "class.status",
        size: 130,
        header: () => <p className="column-title">Class Status</p>,
        cell: ({ row }) => {
          const status = row.original.class?.status;
          if (!status) return <span className="text-muted-foreground">—</span>;
          return (
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: "enrolledAt",
        accessorKey: "createdAt",
        size: 160,
        header: () => <p className="column-title">Enrolled On</p>,
        cell: ({ getValue }) => {
          const date = getValue<string>();
          return (
            <span className="text-muted-foreground text-sm">
              {date ? new Date(date).toLocaleDateString() : "—"}
            </span>
          );
        },
      },
      ...(canDelete
        ? [
            {
              id: "actions",
              size: 120,
              header: () => <p className="column-title">Actions</p>,
              cell: ({ row }: { row: { original: EnrollmentListItem } }) => (
                <DeleteButton
                  resource="enrollments"
                  recordItemId={row.original.id}
                  variant="outline"
                  size="sm"
                  hideText
                />
              ),
            } as ColumnDef<EnrollmentListItem>,
          ]
        : []),
    ],
    [canDelete]
  );

  const searchFilters = searchQuery
    ? [
        {
          field: "search",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const enrollmentsTable = useTable<EnrollmentListItem>({
    columns: enrollmentColumns,
    refineCoreProps: {
      resource: "enrollments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...searchFilters],
      },
      sorters: {
        initial: [{ field: "createdAt", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Enrollments</h1>

      <div className="intro-row">
        <p>View and manage student class enrollments.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search enrollments..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <DataTable table={enrollmentsTable} />
    </ListView>
  );
};

export default EnrollmentsList;
