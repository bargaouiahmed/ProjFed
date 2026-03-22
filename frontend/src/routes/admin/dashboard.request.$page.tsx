import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import useGetRequests from "@/querys/useGetRequests";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard/request/$page")({
  component: RouteComponent,
});

function RouteComponent() {
  const { page } = Route.useParams();
  const { data: requests, isError } = useGetRequests(parseInt(page));

  if (isError) return <div>error ...</div>;

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-4xl px-4 flex flex-col items-center justify-center h-[90vh]">
        <p className="text-xl font-semibold mb-4">Requests</p>

        <Table>
          <TableCaption>Requests</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Institute</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {requests?.map((req) => (
              <TableRow key={req.requestId}>
                <TableCell>{req.email}</TableCell>
                <TableCell>{req.firstname}</TableCell>
                <TableCell>{req.lastname}</TableCell>
                <TableCell>{req.instituteName}</TableCell>
                <TableCell>{req.instituteCountry}</TableCell>
                <TableCell>{req.instituteCity}</TableCell>
                <TableCell>{req.status}</TableCell>
                <TableCell>
                  {new Date(req.requestedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
