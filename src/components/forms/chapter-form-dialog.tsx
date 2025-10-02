import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the validation schema using zod
const chapterSchema = z.object({
  name: z.string().min(1, "Chapter name is required"),
});

type ChapterFormValues = z.infer<typeof chapterSchema>;

export function ChapterFormDailog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "", // Default value for the name field
    },
  });
  const onSubmit = async (data: ChapterFormValues) => {
    console.log("Form submitted:", data);
    try {
      await fetch("/api/blw-zone/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setOpen(false); // Close the dialog after submission
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" flex flex-col gap-y-3"
        >
          <DialogHeader>
            <DialogTitle>Add Chapter</DialogTitle>
            <DialogDescription>Enter Chapter name</DialogDescription>
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
              {isSubmitting ? "..." : "Add Chapter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
