import type { CourseManagerTarget } from "@/routes/administration/dashboard.classes"; // or co-locate the type
import { Button } from "@/components/ui/button";
import useListMClasses from "@/querys/administration/useListMClasses";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconBook } from "@tabler/icons-react";
import { useState } from "react";

interface ClassListDialogProps {
  metadataId: string;
  onSelectCourse: (target: CourseManagerTarget) => void;
  trigger: React.ReactNode;
}

export function ClassListDialog({
  metadataId,
  onSelectCourse,
  trigger,
}: ClassListDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: classList, isLoading } = useListMClasses({
    metadataId,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Classes List</DialogTitle>
        </DialogHeader>

        <div className="max-h-100 overflow-y-auto border rounded-md p-2">
          {isLoading ? (
            <div>Loading...</div>
          ) : classList?.length === 0 ? (
            <div>No classes found</div>
          ) : (
            <div className="flex flex-col gap-2">
              {classList?.map((cls) => (
                <div
                  key={cls.id}
                  className="p-3 border rounded-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{cls.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.classCode}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      Term {cls.currentTerm}/{cls.maxTerms}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        onSelectCourse({
                          id: cls.id,
                          className: cls.className,
                          classCode: cls.classCode,
                        })
                      }
                    >
                      <IconBook size={16} className="mr-1" />
                      Courses
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
