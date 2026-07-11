import { useMemo, useState } from "react";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";

import { ClassDetails, Subject, User } from "@/types";

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const subjects = subjectsQuery.data?.data || [];
  const teachers = teachersQuery.data?.data || [];

  const classColumns = useMemo<ColumnDef<ClassDetails>[]>(
    () => [
      {
        id: "banner",
        header: () => <p className="column-title">Banner</p>,
        cell: ({ row }) => {
          const bannerUrl = row.original.bannerUrl;

          return bannerUrl ? (
            <img
              src={bannerUrl}
              alt={row.original.name}
              className="h-10 w-16 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-16 rounded-md bg-muted" />
          );
        },
        size: 90,
      },
      {
        id: "name",
        accessorKey: "name",
        header: () => <p className="column-title">Class Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        size: 220,
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const isActive = status === "active";

          return (
            <Badge variant={isActive ? "default" : "secondary"}>
              {status}
            </Badge>
          );
        },
        size: 110,
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        size: 180,
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        size: 180,
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => <span>{getValue<number>()}</span>,
        size: 90,
      },
    ],
    []
  );

  const subjectFilters =
    selectedSubject === "all"
      ? []
      : [
          {
            field: "subject",
            operator: "eq" as const,
            value: selectedSubject,
          },
        ];

  const teacherFilters =
    selectedTeacher === "all"
      ? []
      : [
          {
            field: "teacher",
            operator: "eq" as const,
            value: selectedTeacher,
          },
        ];

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const table = useTable<ClassDetails>({
    columns: classColumns,
    refineCoreProps: {
      resource: "classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...subjectFilters, ...teacherFilters, ...searchFilters],
      },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Manage classes and schedules.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search classes by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="">
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={table} />
    </ListView>
  );
};

export default ClassesList;
