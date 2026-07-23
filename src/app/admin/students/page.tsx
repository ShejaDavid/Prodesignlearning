"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { adminStudentSchema, type AdminStudentFormData } from "@/lib/validations";
import { useToast } from "@/components/providers/toast-provider";
import { Loader2, UserPlus, Trash2 } from "lucide-react";

const STATUS_FILTERS = [
  { value: "ALL", label: "All statuses" },
  { value: "ENROLLED", label: "Enrolled" },
  { value: "PENDING", label: "Pending" },
  { value: "PAYMENT_PENDING", label: "Payment Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NONE", label: "Awaiting enrolment" },
] as const;

interface StudentRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  createdAt: string;
  enrollmentStatus: string | null;
  courseTitle: string | null;
  cohortName: string | null;
  enrollmentId: string | null;
  enrollmentCount: number;
  hasPassword: boolean;
}

export default function AdminStudentsPage() {
  const toast = useToast();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]["value"]>("ALL");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<AdminStudentFormData>({
    resolver: zodResolver(adminStudentSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "" },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const fetchStudents = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/students");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load students.");
      }
      setStudents(data.students ?? []);
    } catch (err) {
      setStudents([]);
      setLoadError(err instanceof Error ? err.message : "Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // State updates happen after the async fetch resolves, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
  }, [fetchStudents]);

  async function onAdd(data: AdminStudentFormData) {
    setError(null);
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      const message = json.error || "Failed to create student.";
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(`${data.firstName} ${data.lastName} added.`);
    reset();
    setShowForm(false);
    await fetchStudents();
  }

  async function onRemove(student: StudentRecord) {
    if (
      !window.confirm(
        `Remove ${student.firstName} ${student.lastName}? This permanently deletes the student and their enrolments.`
      )
    ) {
      return;
    }
    setError(null);
    setDeletingId(student.id);
    const res = await fetch(`/api/admin/students?id=${student.id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    setDeletingId(null);
    if (!res.ok) {
      const message = json.error || "Failed to remove student.";
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(`${student.firstName} ${student.lastName} removed.`);
    await fetchStudents();
  }

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.firstName.toLowerCase().includes(search.toLowerCase()) ||
        s.lastName.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "NONE"
          ? !s.enrollmentStatus
          : s.enrollmentStatus === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const columns: Column<StudentRecord>[] = [
    { key: "name", header: "Name", render: (s) => `${s.firstName} ${s.lastName}` },
    { key: "email", header: "Email" },
    {
      key: "account",
      header: "Account",
      render: (s) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            s.hasPassword ? "bg-success/10 text-success" : "bg-amber-50 text-amber-600"
          }`}
        >
          {s.hasPassword ? "Active" : "Invite pending"}
        </span>
      ),
    },
    {
      key: "enrollmentStatus",
      header: "Status",
      render: (s) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            s.enrollmentStatus === "ENROLLED"
              ? "bg-success/10 text-success"
              : s.enrollmentStatus
                ? "bg-amber-50 text-amber-600"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {s.enrollmentStatus?.replace(/_/g, " ") ?? "Awaiting enrolment"}
        </span>
      ),
    },
    {
      key: "courseTitle",
      header: "Course",
      render: (s) => s.courseTitle ?? s.cohortName ?? "—",
    },
    { key: "createdAt", header: "Registered", render: (s) => formatDate(s.createdAt) },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (s) => (
        <div className="flex items-center justify-end gap-3">
          {!s.enrollmentId && (
            <Link
              href={`/admin/enroll?email=${encodeURIComponent(s.email)}&firstName=${encodeURIComponent(s.firstName)}&lastName=${encodeURIComponent(s.lastName)}&phone=${encodeURIComponent(s.phone ?? "")}`}
              className="text-xs font-medium text-secondary hover:underline"
            >
              Enrol
            </Link>
          )}
          <button
            type="button"
            onClick={() => onRemove(s)}
            disabled={deletingId === s.id}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            {deletingId === s.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Remove
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage registered students and enrollments
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onAdd)}
          className="space-y-4 rounded-2xl border border-border bg-muted/20 p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" {...register("phone")} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Creates a student record only. Use{" "}
            <span className="font-medium">Enrol Student</span> to grant course
            access and send the activation email.
          </p>
          <Button type="submit" size="sm" variant="premium" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Create student"
            )}
          </Button>
        </form>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {loadError}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading students...</p>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {students.length} students
            </p>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number]["value"])
              }
              className="h-9 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by name or email..."
            emptyMessage={
              loadError
                ? "Students could not be loaded."
                : "No students match the current filters."
            }
          />
        </div>
      )}
    </div>
  );
}
