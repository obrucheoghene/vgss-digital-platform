"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStaffRequest } from "@/hooks/use-staff-requests";

// Validation schema
const staffRequestSchema = z.object({
  positionTitle: z
    .string()
    .min(1, "Position title is required")
    .max(255, "Position title too long"),
  positionDescription: z
    .string()
    .min(1, "Position description is required")
    .min(20, "Description should be at least 20 characters"),
  numberOfStaff: z
    .number()
    .min(1, "At least 1 staff required")
    .max(10, "Maximum 10 staff per request"),
  skillsRequired: z.string().optional(),
  qualificationsRequired: z.string().optional(),
  preferredGender: z.enum(["MALE", "FEMALE", ""]).optional(),
  urgency: z.enum(["Low", "Medium", "High", "Urgent"]),
});

type StaffRequestFormValues = z.infer<typeof staffRequestSchema>;

interface StaffRequestFormDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
}

export function StaffRequestFormDialog({
  open,
  setOpen,
  onSuccess,
}: StaffRequestFormDialogProps) {
  const createRequest = useCreateStaffRequest();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffRequestFormValues>({
    resolver: zodResolver(staffRequestSchema),
    defaultValues: {
      positionTitle: "",
      positionDescription: "",
      numberOfStaff: 1,
      skillsRequired: "",
      qualificationsRequired: "",
      preferredGender: "",
      urgency: "Medium",
    },
  });

  const onSubmit = async (data: StaffRequestFormValues) => {
    try {
      await createRequest.mutateAsync({
        positionTitle: data.positionTitle,
        positionDescription: data.positionDescription,
        numberOfStaff: data.numberOfStaff,
        skillsRequired: data.skillsRequired || undefined,
        qualificationsRequired: data.qualificationsRequired || undefined,
        preferredGender:
          data.preferredGender === ""
            ? undefined
            : (data.preferredGender as "MALE" | "FEMALE"),
        urgency: data.urgency,
      });
      reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the hook
      console.error("Error creating staff request:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
          <DialogHeader>
            <DialogTitle>Request New Staff</DialogTitle>
            <DialogDescription>
              Submit a request for VGSS staff to be assigned to your department.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Position Title */}
            <div className="space-y-2">
              <Label htmlFor="positionTitle">Position Title *</Label>
              <Input
                id="positionTitle"
                {...register("positionTitle")}
                placeholder="e.g., Administrative Assistant"
                aria-invalid={!!errors.positionTitle}
              />
              {errors.positionTitle && (
                <p className="text-red-500 text-sm">
                  {errors.positionTitle.message}
                </p>
              )}
            </div>

            {/* Position Description */}
            <div className="space-y-2">
              <Label htmlFor="positionDescription">Position Description *</Label>
              <Textarea
                id="positionDescription"
                {...register("positionDescription")}
                placeholder="Describe the role, responsibilities, and expectations..."
                rows={4}
                aria-invalid={!!errors.positionDescription}
              />
              {errors.positionDescription && (
                <p className="text-red-500 text-sm">
                  {errors.positionDescription.message}
                </p>
              )}
            </div>

            {/* Number of Staff and Urgency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfStaff">Number of Staff *</Label>
                <Input
                  id="numberOfStaff"
                  type="number"
                  min={1}
                  max={10}
                  {...register("numberOfStaff", { valueAsNumber: true })}
                  aria-invalid={!!errors.numberOfStaff}
                />
                {errors.numberOfStaff && (
                  <p className="text-red-500 text-sm">
                    {errors.numberOfStaff.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Urgency *</Label>
                <Controller
                  name="urgency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.urgency && (
                  <p className="text-red-500 text-sm">{errors.urgency.message}</p>
                )}
              </div>
            </div>

            {/* Preferred Gender */}
            <div className="space-y-2">
              <Label>Preferred Gender (Optional)</Label>
              <Controller
                name="preferredGender"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No preference</SelectItem>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Skills Required */}
            <div className="space-y-2">
              <Label htmlFor="skillsRequired">Skills Required (Optional)</Label>
              <Textarea
                id="skillsRequired"
                {...register("skillsRequired")}
                placeholder="e.g., Microsoft Office, Communication skills, Event planning..."
                rows={2}
              />
            </div>

            {/* Qualifications Required */}
            <div className="space-y-2">
              <Label htmlFor="qualificationsRequired">
                Qualifications Required (Optional)
              </Label>
              <Textarea
                id="qualificationsRequired"
                {...register("qualificationsRequired")}
                placeholder="e.g., Bachelor's degree in any field, Experience in administration..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
