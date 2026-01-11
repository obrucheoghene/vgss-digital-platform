import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Define the validation schema using zod
const chapterSchema = z.object({
  name: z.string().min(1, "Chapter name is required"),
});

type ChapterFormValues = z.infer<typeof chapterSchema>;

interface Chapter {
  id: string;
  name: string;
}

interface ChapterFormDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  chapter?: Chapter | null; // Optional chapter for edit mode
  onSuccess?: () => void;
}

export function ChapterFormDailog({
  open,
  setOpen,
  chapter,
  onSuccess,
}: ChapterFormDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!chapter;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: chapter?.name || "",
    },
  });

  // Reset form when dialog opens/closes or chapter changes
  useEffect(() => {
    if (open) {
      reset({
        name: chapter?.name || "",
      });
    }
  }, [open, chapter, reset]);

  const onSubmit = async (data: ChapterFormValues) => {
    try {
      if (isEditMode && chapter) {
        // Update existing chapter
        await axios.put(`/api/blw-zone/chapters/${chapter.id}`, data);
        toast.success("Chapter updated successfully");
      } else {
        // Create new chapter
        await axios.post("/api/blw-zone/chapters", data);
        toast.success("Chapter created successfully");
      }

      // Invalidate chapters query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["chapters-for-zone"] });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.error || "Submission failed";
        setError("name", { message });
        toast.error(message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Chapter" : "Add Chapter"}
            </DialogTitle>

            {errors.root && (
              <p className="text-red-500 text-sm">{errors.root.message}</p>
            )}
            <DialogDescription>
              {isEditMode
                ? "Update the chapter name"
                : "Enter chapter name"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Input
                {...register("name")}
                placeholder="Chapter Name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button disabled={isSubmitting} type="submit" variant="default">
              {isSubmitting
                ? "..."
                : isEditMode
                ? "Update Chapter"
                : "Add Chapter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
