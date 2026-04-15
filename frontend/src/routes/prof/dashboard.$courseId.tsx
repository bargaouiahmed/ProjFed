import { createFileRoute } from "@tanstack/react-router";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconBook,
  IconLoader2,
  IconPaperclip,
} from "@tabler/icons-react";

// Components & Hooks
import { FormikInput } from "@/components/form/formikInput";
import { Button } from "@/components/ui/button"; // Assuming your UI library button
import useChapters from "@/querys/professor/useChapters";
import useDeleteChapter from "@/querys/professor/useDeleteChapter";
import useUpdateChapter from "@/querys/professor/useUpdateChapter";
import useInitChapter from "@/querys/professor/useInitChapter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDownloadChapters from "@/querys/useDownloadChapters";

interface Chapter {
  id: string;
  title?: string;
  description: string;
  attachments?: File[];
}

export const Route = createFileRoute("/prof/dashboard/$courseId")({
  component: RouteComponent,
});

const UpdateSchema = Yup.object().shape({
  title: Yup.string().required("title is required"),
  description: Yup.string().optional(),
  attachments: Yup.array().of(Yup.mixed()),
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: chapters, isLoading } = useChapters(courseId);
  const { mutate: initChapter, isPending: isInitializing } = useInitChapter();
  const { mutate: deleteChapter } = useDeleteChapter();
  const { mutate: updateChapter, isPending: isUpdating } = useUpdateChapter();

  const { mutate: downloadAttachemnts } = useDownloadChapters();

  console.log(chapters);
  if (isLoading)
    return (
      <div className="p-8 text-center">
        <IconLoader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Course Chapters</h1>
          <p className="text-muted-foreground text-sm">Course ID: {courseId}</p>
        </div>
        <Button
          onClick={() => initChapter(courseId)}
          disabled={isInitializing}
          className="gap-2"
        >
          {isInitializing ? (
            <IconLoader2 className="animate-spin" size={18} />
          ) : (
            <IconPlus size={18} />
          )}
          Initialize New Chapter
        </Button>
      </div>

      {/* Chapters List */}
      <div className="grid gap-4">
        {chapters?.map((chapter: Chapter, index: number) => (
          <div
            key={chapter.id}
            className="border rounded-xl bg-card p-4 flex items-center justify-between shadow-sm"
          >
            <div>
              <div className="flex items-center gap-4">
                <div className="bg-muted w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold">
                    {chapter.title || "Untitled Chapter"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {chapter.description}
                  </p>
                </div>
              </div>
              <Button
                variant={"ghost"}
                className="ml-15 mt-2 text-sm underline cursor-pointer"
                onClick={() => {
                  downloadAttachemnts(chapter.id);
                }}
              >
                download attachemnts
              </Button>
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <IconEdit size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Update Chapter</DialogTitle>
                  </DialogHeader>

                  <Formik
                    initialValues={{
                      title: chapter.title || "",
                      description: chapter.description || "",
                      attachments: [] as (File | null)[],
                    }}
                    validationSchema={UpdateSchema}
                    onSubmit={(values) => {
                      const formData = new FormData();
                      formData.append("id", chapter.id);
                      if (values.title) formData.append("title", values.title);
                      formData.append("description", values.description);

                      values.attachments.forEach((file) => {
                        if (file) formData.append("attachments", file);
                      });

                      updateChapter({ data: formData });
                    }}
                  >
                    {({ values }) => (
                      <Form className="space-y-4">
                        <FormikInput name="title" label="Chapter Title" />
                        <FormikInput name="description" label="Description" />

                        {/* Dynamic Attachments Section */}
                        <div className="space-y-8">
                          <label className="text-sm font-medium ">
                            Attachments
                          </label>

                          <FieldArray name="attachments">
                            {({ push, remove }) => (
                              <div className="space-y-4">
                                {/* Wrap the list in ScrollArea */}
                                <ScrollArea
                                  className={`${values.attachments.length > 0 ? "h-62.5" : "h-auto"} w-full rounded-md border p-4`}
                                >
                                  <div className="space-y-4 pr-3">
                                    {" "}
                                    {/* Added padding-right to avoid scrollbar overlap */}
                                    {values.attachments.map((_, index) => (
                                      <div
                                        key={index}
                                        className="flex items-end justify-center gap-2 animate-in fade-in slide-in-from-left-2 relative"
                                      >
                                        <div className="relative">
                                          <FormikInput
                                            name={`attachments.${index}`}
                                            label={`File #${index + 1}`}
                                            type="file"
                                          />
                                        </div>
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          className=" absolute top-10 right-10"
                                          onClick={() => remove(index)}
                                        >
                                          <IconTrash size={16} />
                                        </Button>
                                      </div>
                                    ))}
                                    {values.attachments.length === 0 && (
                                      <p className="text-xs text-center text-muted-foreground py-4">
                                        No files attached yet.
                                      </p>
                                    )}
                                  </div>
                                </ScrollArea>

                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="w-full gap-2 border-dashed border-2"
                                  onClick={() => push(null)}
                                >
                                  <IconPaperclip size={18} />
                                  Add Another Attachment
                                </Button>
                              </div>
                            )}
                          </FieldArray>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Updating..." : "Save Changes"}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"} size={"icon"}>
                    <IconTrash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>
                    Are you sure you want to delete {chapter.title} chapter ?
                  </AlertDialogTitle>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant={"destructive"}
                      onClick={() => {
                        deleteChapter(chapter.id);
                      }}
                    >
                      yes delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}

        {chapters?.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <IconBook
              className="mx-auto text-muted-foreground/30 mb-2"
              size={48}
            />
            <p className="text-muted-foreground">No chapters found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
