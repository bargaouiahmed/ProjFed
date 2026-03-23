import {
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import useAcceptRequest from "@/querys/useAcceptRequest";
import useGetRequests from "@/querys/useGetRequests";
import useRejectRequest from "@/querys/useRejectRequest";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/dashboard/requests/$page")({
  component: RouteComponent,
});

function RouteComponent() {
  const { page } = Route.useParams();
  const { data: requests, isError } = useGetRequests(parseInt(page));
  const [rejectMessage, setRejectMessage] = useState("");
  const { mutate: acceptRequest } = useAcceptRequest();
  const { mutate: rejectRequest } = useRejectRequest();
  let numberOfPages = 1;
  if (requests) {
    numberOfPages = Math.ceil(requests[0].totalRequestsCount / 10);
  }
  console.log(requests);
  if (isError) return <div>error ...</div>;

  return (
    <div className=" h-full flex items-center justify-center p-2">
      <div>
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
              <TableHead>Actions</TableHead>
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

                <TableCell className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={"success"}
                        disabled={req.status === "accepted"}
                      >
                        Accept
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader className="text-xl">
                        Are you sure you want to accept {req.instituteName}{" "}
                        institue ?
                        <AlertDialogDescription></AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant={"success"}
                          onClick={() => {
                            acceptRequest({ requestId: req.requestId });
                          }}
                        >
                          accept
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={"destructive"}
                        disabled={req.status === "rejected"}
                      >
                        reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader className="text-xl">
                        Are you sure you want to reject {req.instituteName}{" "}
                        institue ?
                        <AlertDialogDescription></AlertDialogDescription>
                      </AlertDialogHeader>

                      <form
                        className="flex flex-col gap-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <label>rejection message : </label>
                        <Textarea
                          onChange={(e) => {
                            setRejectMessage(e.target.value);
                          }}
                        />
                      </form>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant={"destructive"}
                          onClick={() => {
                            rejectRequest({
                              requestId: req.requestId,
                              message: rejectMessage,
                            });
                          }}
                        >
                          reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter className="bg-background hover:bg-background">
            <TableRow>
              <TableCell colSpan={9}>
                <div className="flex justify-end items-center gap-2">
                  {/* Previous */}
                  <Link
                    to="/admin/dashboard/requests/$page"
                    params={{ page: String(Math.max(1, parseInt(page) - 1)) }}
                  >
                    <Button disabled={parseInt(page) === 1} variant={"outline"}>
                      <IconArrowLeft />
                    </Button>
                  </Link>

                  <Button variant={"ghost"}>{page}</Button>

                  {/* Next */}
                  <Link
                    to="/admin/dashboard/requests/$page"
                    params={{
                      page: String(Math.min(numberOfPages, parseInt(page) + 1)),
                    }}
                  >
                    <Button
                      size={"icon-lg"}
                      variant={"outline"}
                      disabled={parseInt(page) === numberOfPages}
                    >
                      <IconArrowRight />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
