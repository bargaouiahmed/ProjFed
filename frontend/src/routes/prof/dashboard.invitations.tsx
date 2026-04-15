import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAcceptProfInvitations from "@/querys/professor/useAcceptProfInvitations";
import useGetProfInvitations from "@/querys/professor/useGetProfInvitations";
import useRejectProfInvitations from "@/querys/professor/useRejectProfInvitations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/prof/dashboard/invitations")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: invitations, isLoading } = useGetProfInvitations();
  console.log(invitations);
  const { mutate: accept, isPending: isAccepting } = useAcceptProfInvitations();
  const { mutate: reject, isPending: isRejecting } = useRejectProfInvitations();

  if (isLoading) return <p>isLoading...</p>;
  return (
    <main className="p-8 flex flex-col">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invitations</h1>
          <p className="text-muted-foreground max-w-[40ch]">
            manage your invitations
          </p>
        </div>
      </div>

      {/* Table */}
      <div>
        <Table className="border">
          <TableCaption>Invitations</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Universty name</TableHead>
              <TableHead>class</TableHead>
              <TableHead>Course</TableHead>
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
                  <TableCell>{invitation.institueName}</TableCell>
                  <TableCell>{invitation.classPrettyName}</TableCell>

                  <TableCell>{invitation.courseName}</TableCell>
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
                        onClick={() => accept({ invitationId: invitation.id })}
                      >
                        Accept
                      </Button>

                      <Button
                        variant="destructive"
                        disabled={!isPendingStatus || isRejecting}
                        onClick={() => reject(invitation.id)}
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
