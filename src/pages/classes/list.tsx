import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { ListView } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useTable } from "@refinedev/react-table";

import { ClassDetails } from "@/types";

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const classColumns = useMemo<ColumnDef<ClassDetails>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
        size: 250,
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
        size: 80,
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
        size: 100,
      },
      {
        id: "details",
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton resource="classes" recordItemId={row.original.id} size="sm" variant="outline">
            View
          </ShowButton>
        ),
        size: 120,
      },
    ],
    []
  );

  const table = useTable<ClassDetails>({
    columns: classColumns,
    refineCoreProps: {
      resource: "classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: searchQuery
          ? [
              {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
              },
            ]
          : [],
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={table} />
    </ListView>
  );
};

export default ClassesList;
