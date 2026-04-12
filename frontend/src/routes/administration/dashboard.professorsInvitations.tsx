import useProfInvitations from "@/querys/professor/useProfInvitations";
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

export const Route = createFileRoute(
  "/administration/dashboard/professorsInvitations",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: invitations, isLoading, error } = useProfInvitations();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading professor invitations</div>;

  return (
    <main className="p-8 flex flex-col">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Professor Invitations</h1>
          <p className="text-muted-foreground max-w-[40ch]">
            View all professor invitations across your institute.
          </p>
        </div>
      </div>

      <div>
        <Table className="border">
          <TableCaption>Professor Invitations</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invitations?.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell>{invitation.professorEmail}</TableCell>

                <TableCell>{invitation.courseName}</TableCell>

                <TableCell>{invitation.classPrettyName}</TableCell>

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
