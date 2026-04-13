import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useListUniUsers from "@/querys/useListUniUsers";
import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  IconUsers,
  IconSchool,
  IconUserStar,
  IconArrowLeft,
  IconArrowRight,
  IconSearch,
} from "@tabler/icons-react";
import z from "zod";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/administration/dashboard/")({
  component: RouteComponent,
  validateSearch: z.object({
    pageNumber: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
  }),
});

// ─── Role config ──────────────────────────────────────────────────────────────

interface RoleConfig {
  label: string;
  badge: string;
  icon: React.ElementType;
  iconAccent: string;
  iconColor: string;
  sub: string;
}

const roleConfig: Record<string, RoleConfig> = {
  student: {
    label: "Students",
    badge:
      "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800",
    icon: IconSchool,
    iconAccent: "bg-green-50 dark:bg-green-950",
    iconColor: "text-green-700 dark:text-green-300",
    sub: "Active enrolments",
  },
  professor: {
    label: "Professors",
    badge:
      "bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800",
    icon: IconUserStar,
    iconAccent: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-700 dark:text-amber-300",
    sub: "Across all departments",
  },
  uni_staff: {
    label: "Staff",
    badge:
      "bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800",
    icon: IconUsers,
    iconAccent: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-700 dark:text-blue-300",
    sub: "Administrative & support",
  },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  first,
  last,
  role,
}: {
  first: string;
  last: string;
  role: string;
}) {
  const cfg = roleConfig[role];
  return (
    <div
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 select-none",
        cfg?.iconAccent ?? "bg-muted",
        cfg?.iconColor ?? "text-muted-foreground",
      )}
    >
      {first[0]}
      {last[0]}
    </div>
  );
}

// ─── Route component ──────────────────────────────────────────────────────────

function RouteComponent() {
  const { pageNumber, pageSize } = Route.useSearch();
  const { data: users, isLoading } = useListUniUsers({ pageNumber, pageSize });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const allUsers = useMemo(() => {
    return users?.users ?? [];
  }, [users]);

  const counts = useMemo(
    () =>
      allUsers.reduce<Record<string, number>>((acc, u) => {
        acc[u.role] = (acc[u.role] ?? 0) + 1;
        return acc;
      }, {}),
    [allUsers],
  );

  const filtered = useMemo(
    () =>
      allUsers.filter((u) => {
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          u.firstname.toLowerCase().includes(q) ||
          u.lastname.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q);
        return matchRole && matchSearch;
      }),
    [allUsers, search, roleFilter],
  );

  const numberOfPages = Math.max(
    Math.ceil((users?.totalCount || 0) / pageSize),
    1,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground text-sm">
        Loading users…
      </div>
    );
  }

  return (
    <main className="p-6 flex flex-col min-h-screen gap-6">
      {/* ── Page header ── */}
      <div className="mt-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          Administration dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and monitor all university accounts — staff, professors, and
          students.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(roleConfig).map(([role, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div
              key={role}
              className="rounded-md border border-border bg-card p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {cfg.label}
                </span>
                <div
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center",
                    cfg.iconAccent,
                  )}
                >
                  <Icon size={16} className={cfg.iconColor} />
                </div>
              </div>
              <p className="text-3xl font-semibold tabular-nums">
                {counts[role] ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">{cfg.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Search & filter bar ── */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <IconSearch
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            className="pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="professor">Professors</SelectItem>
            <SelectItem value="uni_staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ── */}
      <div className="rounded-sm border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-card">
          <span className="text-sm font-medium">All users</span>
          <span className="text-xs text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-10 text-muted-foreground text-sm"
                >
                  No users match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        first={user.firstname}
                        last={user.lastname}
                        role={user.role}
                      />
                      <span className="text-sm font-medium">
                        {user.firstname} {user.lastname}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full",
                        roleConfig[user.role]?.badge ??
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {roleConfig[user.role]?.label ?? user.role}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Page {pageNumber} of {numberOfPages}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      to="/administration/dashboard"
                      search={{
                        pageNumber: Math.max(pageNumber - 1, 1),
                        pageSize,
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pageNumber === 1}
                      >
                        <IconArrowLeft size={14} />
                        Prev
                      </Button>
                    </Link>
                    <Link
                      to="/administration/dashboard"
                      search={{
                        pageNumber: Math.min(pageNumber + 1, numberOfPages),
                        pageSize,
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pageNumber === numberOfPages}
                      >
                        Next
                        <IconArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}
