import { AdvancedImage } from "@cloudinary/react";
import { useShow, useCreate, useSelect, useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails } from "@/types";

type EnrollmentRecord = {
  id: number;
  classId: number;
  studentId: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
};

const ClassesShow = () => {
  const { id } = useParams();
  const classId = id ?? "";

  const { query } = useShow<ClassDetails>({
    resource: "classes",
  });

  const classDetails = query.data?.data;

  // Enrollment Logic
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const { mutate: createEnrollment, mutationResult } = useCreate() as any;
  const isEnrolling = mutationResult?.isPending || mutationResult?.isLoading;

  // Fetch all enrollments for this class (unpaginated) to filter out enrolled students from the dropdown
  const { query: allEnrollmentsQuery } = useList<EnrollmentRecord>({
    resource: "enrollments",
    filters: [{ field: "classId", operator: "eq", value: classId }],
    pagination: { mode: "off" },
  });

  const enrolledStudentIds = useMemo(
    () => new Set(allEnrollmentsQuery.data?.data?.map((e) => String(e.studentId)) || []),
    [allEnrollmentsQuery.data]
  );

  const { options: studentOptions } = useSelect({
    resource: "students",
    optionLabel: "name",
    optionValue: "id",
  });

  const availableStudentOptions = useMemo(
    () => studentOptions.filter((opt) => !enrolledStudentIds.has(String(opt.value))),
    [studentOptions, enrolledStudentIds]
  );

  const handleEnroll = () => {
    if (!selectedStudentId || selectedStudentId === "none") return;
    createEnrollment(
      {
        resource: "enrollments",
        values: {
          classId,
          studentId: selectedStudentId,
        },
      },
      {
        onSuccess: () => {
          setSelectedStudentId("");
        },
      }
    );
  };

  const studentColumns = useMemo<ColumnDef<EnrollmentRecord>[]>(
    () => [
      {
        id: "name",
        accessorKey: "student.name",
        size: 240,
        header: () => <p className="column-title">Student</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {row.original.student?.image && (
                <AvatarImage src={row.original.student.image} alt={row.original.student.name} />
              )}
              <AvatarFallback>{getInitials(row.original.student?.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="truncate">{row.original.student?.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.student?.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "actions",
        size: 140,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <DeleteButton
            resource="enrollments"
            recordItemId={row.original.id}
            size="sm"
            hideText
          />
        ),
      },
    ],
    []
  );

  const studentsTable = useTable<EnrollmentRecord>({
    columns: studentColumns,
    refineCoreProps: {
      resource: "enrollments",
      pagination: {
        pageSize: 5,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "classId",
            operator: "eq",
            value: classId,
          },
        ],
      },
    },
  });

  if (query.isLoading || query.isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />
        <p className="state-message">
          {query.isLoading
            ? "Loading class details..."
            : query.isError
            ? "Failed to load class details."
            : "Class details not found."}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails.teacher?.name ?? "Unknown";
  const teacherInitials = getInitials(teacherName);

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teacherInitials || "NA"
  )}`;

  return (
    <ShowView className="class-view class-show space-y-6">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner">
        {classDetails.bannerUrl ? (
          classDetails.bannerUrl.includes("res.cloudinary.com") &&
          classDetails.bannerCldPubId ? (
            <AdvancedImage
              cldImg={bannerPhoto(
                classDetails.bannerCldPubId ?? "",
                classDetails.name
              )}
              alt="Class Banner"
            />
          ) : (
            <img
              src={classDetails.bannerUrl}
              alt={classDetails.name}
              loading="lazy"
            />
          )
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        {/* Class Details */}
        <div>
          <div className="details-header">
            <div>
              <h1>{classDetails.name}</h1>
              <p>{classDetails.description}</p>
            </div>

            <div className="flex gap-2">
              <Badge variant="outline">
                {classDetails.enrollmentCount ?? 0} / {classDetails.capacity} Enrolled
              </Badge>
              {(() => {
                const enrolled = classDetails.enrollmentCount ?? 0;
                const available = classDetails.capacity - enrolled;
                if (available <= 0) return <Badge variant="destructive">Full</Badge>;
                if (available <= 5) return <Badge variant="secondary">Nearly Full</Badge>;
                return <Badge variant="default">Available</Badge>;
              })()}
              <Badge
                variant={
                  classDetails.status === "active" ? "default" : "secondary"
                }
                data-status={classDetails.status}
              >
                {classDetails.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="details-grid">
            <div className="instructor">
              <p>👨‍🏫 Instructor</p>
              <div>
                <img
                  src={classDetails.teacher?.image ?? placeholderUrl}
                  alt={teacherName}
                />

                <div>
                  <p>{teacherName}</p>
                  <p>{classDetails?.teacher?.email}</p>
                </div>
              </div>
            </div>

            <div className="department">
              <p>🏛️ Department</p>

              <div>
                <p>{classDetails?.department?.name}</p>
                <p>{classDetails?.department?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Card */}
        <div className="subject">
          <p>📚 Subject</p>

          <div>
            <Badge variant="outline">
              Code: <span>{classDetails?.subject?.code}</span>
            </Badge>
            <p>{classDetails?.subject?.name}</p>
            <p>{classDetails?.subject?.description}</p>
          </div>
        </div>

        <Separator />

        {/* Enroll Student Section */}
        <div className="join">
          <h2>🎓 Enroll Student</h2>
          <div className="flex gap-4 mt-4 items-center flex-wrap">
            <Select 
              value={selectedStudentId || undefined} 
              onValueChange={setSelectedStudentId}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select an available student" />
              </SelectTrigger>
              <SelectContent>
                {availableStudentOptions.length === 0 ? (
                  <SelectItem value="none" disabled>No available students</SelectItem>
                ) : (
                  availableStudentOptions.map((opt) => (
                    <SelectItem key={String(opt.value)} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button onClick={handleEnroll} disabled={!selectedStudentId || selectedStudentId === "none" || isEnrolling}>
              {isEnrolling ? "Enrolling..." : "Enroll"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={studentsTable} />
        </CardContent>
      </Card>
    </ShowView>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`.toUpperCase();
};

export default ClassesShow;