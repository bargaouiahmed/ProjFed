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
import z from "zod";

export const Route = createFileRoute("/admin/dashboard/requests")({
  component: RouteComponent,
  validateSearch: z.object({
    pageNumber: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
  }),
});

function RouteComponent() {
  const { pageNumber, pageSize } = Route.useSearch();
  const {
    data: requests,
    isError,
    isPending,
  } = useGetRequests(pageNumber, pageSize);

  const [rejectMessage, setRejectMessage] = useState("");
  const { mutate: acceptRequest } = useAcceptRequest();
  const { mutate: rejectRequest } = useRejectRequest();

  if (isPending)
    return <div className="text-center mt-10">Loading requests...</div>;

  if (isError)
    return (
      <div className="text-center mt-10 text-red-500">
        Error loading requests
      </div>
    );

  const totalCount = requests?.[0]?.totalRequestsCount ?? 0;
  const numberOfPages = Math.max(Math.ceil(totalCount / pageSize), 1);

  return (
    <div className="h-full flex items-center justify-center p-2">
      <div className="w-full max-w-6xl">
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
              <TableHead>Documents</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {requests && requests.length > 0 ? (
              requests.map((req) => (
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

                  <TableCell>
                    <div className="flex flex-col items-center gap-2">
                      <Link to={req.proofDocumentUrl} target="_blank">
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          asChild
                          className="w-34"
                        >
                          proof document
                        </Button>
                      </Link>

                      <Link to={req.identityDocumentUrl} target="_blank">
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          asChild
                          className="w-34"
                        >
                          identity document
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <div className="flex flex-col gap-2">
                      {/* Accept */}
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
                            institute?
                            <AlertDialogDescription />
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant={"success"}
                              onClick={() => {
                                acceptRequest({ requestId: req.requestId });
                              }}
                            >
                              Accept
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Reject */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant={"destructive"}
                            disabled={req.status === "rejected"}
                          >
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader className="text-xl">
                            Are you sure you want to reject {req.instituteName}{" "}
                            institute?
                            <AlertDialogDescription />
                          </AlertDialogHeader>

                          <form
                            className="flex flex-col gap-2"
                            onSubmit={(e) => e.preventDefault()}
                          >
                            <label>Rejection message:</label>
                            <Textarea
                              value={rejectMessage}
                              onChange={(e) => setRejectMessage(e.target.value)}
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
                                setRejectMessage("");
                              }}
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="h-40">
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground"
                >
                  No requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter className="bg-background hover:bg-background">
            <TableRow>
              <TableCell colSpan={9}>
                <div className="flex justify-end items-center gap-2">
                  {/* Previous */}
                  <Link
                    to="/admin/dashboard/requests"
                    search={{
                      pageNumber: Math.max(pageNumber - 1, 1),
                      pageSize: pageSize,
                    }}
                  >
                    <Button disabled={pageNumber === 1} variant={"outline"}>
                      <IconArrowLeft />
                    </Button>
                  </Link>

                  <Button variant={"ghost"}>{pageNumber}</Button>

                  {/* Next */}
                  <Link
                    to="/admin/dashboard/requests"
                    search={{
                      pageNumber: Math.min(pageNumber + 1, numberOfPages),
                      pageSize: pageSize,
                    }}
                  >
                    <Button
                      size={"icon-lg"}
                      variant={"outline"}
                      disabled={pageNumber === numberOfPages}
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
