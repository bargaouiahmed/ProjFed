import { createFileRoute } from "@tanstack/react-router";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import useGetInvitations from "@/querys/administration/useGetInvitations";
import useAcceptInvitation from "@/querys/administration/useAcceptInvitation";
import useRejectInvitation from "@/querys/administration/useRejectInvitation";

export const Route = createFileRoute("/administration/dashboard/invitations")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: invitations, isLoading, error } = useGetInvitations();

  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation();

  const { mutate: rejectInvitation, isPending: isRejecting } =
    useRejectInvitation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading invitations</div>;

  return (
    <main className="p-8 flex flex-col">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invitations Management</h1>
          <p className="text-muted-foreground max-w-[40ch]">
            View and manage your university staff invitations.
          </p>
        </div>
      </div>

      {/* Table */}
      <div>
        <Table className="border">
          <TableCaption>Uni Staff Invitations</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Institute</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invitations?.map((invitation) => {
              const isPendingStatus = invitation.status === "pending";

              return (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.instituteName}</TableCell>

                  <TableCell>
                    <span
                      className={
                        invitation.status === "accepted"
                          ? "text-green-500"
                          : invitation.status === "pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }
                    >
                      {invitation.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    {new Date(invitation.invitedAt).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant={"success"}
                        disabled={!isPendingStatus || isAccepting}
                        onClick={() => acceptInvitation(invitation.id)}
                      >
                        Accept
                      </Button>

                      <Button
                        variant="destructive"
                        disabled={!isPendingStatus || isRejecting}
                        onClick={() => rejectInvitation(invitation.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
