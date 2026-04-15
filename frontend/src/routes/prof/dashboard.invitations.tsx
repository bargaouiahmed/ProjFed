import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAcceptProfInvitations from "@/querys/professor/useAcceptProfInvitations";
import useGetProfInvitations from "@/querys/professor/useGetProfInvitations";
import useRejectProfInvitations from "@/querys/professor/useRejectProfInvitations";
import { IconCalendar, IconMailbox, IconSchool } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/prof/dashboard/invitations")({
  component: RouteComponent,
});

function StatusBadge({ status }: { status: string }) {
  if (status === "accepted")
    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10">
        Accepted
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge className="bg-warning/10 text-warning border border-warning/20 hover:bg-warning/10">
        Pending
      </Badge>
    );
  return (
    <Badge className="bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/10">
      Rejected
    </Badge>
  );
}

function RouteComponent() {
  const { data: invitations, isLoading } = useGetProfInvitations();
  const { mutate: accept, isPending: isAccepting } = useAcceptProfInvitations();
  const { mutate: reject, isPending: isRejecting } = useRejectProfInvitations();

  return (
    <main className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <IconMailbox className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Invitations</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-10">
          Review and respond to your teaching invitations
        </p>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide pl-5">
                University
              </TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Class
              </TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Course
              </TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Status
              </TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Invited At
              </TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted rounded-md w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !invitations?.length ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                    <IconSchool size={32} className="opacity-30" />
                    <p className="text-sm">No invitations yet</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invitation) => {
                const isPendingStatus = invitation.status === "pending";

                return (
                  <TableRow
                    key={invitation.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="pl-5 font-medium text-foreground">
                      {invitation.institueName}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {invitation.classPrettyName}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {invitation.courseName}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={invitation.status} />
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      <span className="flex items-center gap-1.5 text-[13px]">
                        <IconCalendar size={14} className="shrink-0" />
                        {new Date(invitation.invitedAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </TableCell>

                    <TableCell className="pr-5">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-400 shadow-none"
                          disabled={!isPendingStatus || isAccepting}
                          onClick={() =>
                            accept({ invitationId: invitation.id })
                          }
                        >
                          Accept
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20"
                          disabled={!isPendingStatus || isRejecting}
                          onClick={() => reject(invitation.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
