import { useCreate, useDelete, useGetIdentity, useList, useUpdate } from "@refinedev/core";
import { useEffect, useState } from "react";
import { Megaphone, Send, Pencil, Trash2, X, Check } from "lucide-react";

import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User, Announcement, ClassDetails } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";

const AnnouncementsPage = () => {
  const { data: identity } = useGetIdentity<User>();
  const canManage = identity?.role === "admin" || identity?.role === "teacher";

  // Create form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [classId, setClassId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // List state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { mode: "off" },
    queryOptions: { enabled: canManage },
  });
  const classesData = classesQuery.data;

  const { mutate: create } = useCreate() as any;
  const { mutate: update } = useUpdate() as any;
  const { mutate: deleteOne } = useDelete() as any;

  const fetchAnnouncements = () => {
    setIsLoading(true);
    fetch(`${BACKEND_BASE_URL.replace(/\/$/, "")}/announcements?page=1&limit=50`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((payload) => setAnnouncements(payload.data ?? []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = () => {
    if (isSubmitting || !title.trim() || !content.trim() || !classId) return;
    setIsSubmitting(true);
    create(
      { resource: "announcements", values: { title, content, classId: Number(classId) } },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setClassId("");
          fetchAnnouncements();
        },
        onSettled: () => setIsSubmitting(false),
      }
    );
  };

  const startEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setEditTitle(ann.title);
    setEditContent(ann.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleUpdate = (id: number) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    update(
      {
        resource: "announcements",
        id,
        values: { title: editTitle.trim(), content: editContent.trim() },
      },
      {
        onSuccess: () => {
          cancelEdit();
          fetchAnnouncements();
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteOne(
      { resource: "announcements", id },
      { onSuccess: () => fetchAnnouncements() }
    );
  };

  return (
    <ListView>
      <Breadcrumb />
      <div className="flex items-center gap-3">
        <Megaphone className="size-7 text-primary" />
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="text-muted-foreground">Updates for your classes.</p>
        </div>
      </div>

      {canManage && (
        <Card className="mt-2">
          <CardHeader>
            <CardTitle>Post an announcement</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classesData?.data?.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Write an update for the class..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              onClick={handleCreate}
              disabled={isSubmitting || !classId || !title.trim() || !content.trim()}
              className="w-fit gap-2"
            >
              <Send className="size-4" />
              {isSubmitting ? "Posting..." : "Post announcement"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {isLoading && (
          <p className="text-muted-foreground text-sm">Loading announcements...</p>
        )}
        {!isLoading && announcements.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No announcements for your classes yet.
          </p>
        )}

        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="rounded-lg border bg-card p-3 shadow-sm hover:bg-accent/5 transition-colors"
          >
            {editingId === announcement.id ? (
              /* Inline edit form */
              <div className="flex flex-col gap-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                />
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Content"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={() => handleUpdate(announcement.id)}
                    disabled={!editTitle.trim() || !editContent.trim()}
                  >
                    <Check className="size-3.5" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={cancelEdit}>
                    <X className="size-3.5" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <h3 className="font-semibold leading-none">{announcement.title}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {announcement.class?.name ?? "Class"} ·{" "}
                      {announcement.author?.name ?? "Staff"} ·{" "}
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                    {canManage && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={() => startEdit(announcement)}
                          title="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7 text-destructive hover:text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete announcement?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete &quot;{announcement.title}&quot;. This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(announcement.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground/90">
                  {announcement.content}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </ListView>
  );
};

export default AnnouncementsPage;
