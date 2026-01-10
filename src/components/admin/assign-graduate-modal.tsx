"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  useAvailableGraduates,
  useStaffRequestActions,
  AvailableGraduate,
} from "@/hooks/use-staff-requests";
import {
  Search,
  User,
  GraduationCap,
  MapPin,
  Check,
  Loader2,
} from "lucide-react";

interface AssignGraduateModalProps {
  requestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssigned?: () => void;
}

export function AssignGraduateModal({
  requestId,
  open,
  onOpenChange,
  onAssigned,
}: AssignGraduateModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [selectedGraduate, setSelectedGraduate] =
    useState<AvailableGraduate | null>(null);
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [page, setPage] = useState(1);

  const { data: graduatesData, isLoading } = useAvailableGraduates({
    search: searchQuery,
    gender: genderFilter,
    page,
    limit: 10,
  });

  const { mutate: performAction, isPending: isAssigning } =
    useStaffRequestActions();

  const graduates = graduatesData?.graduates || [];
  const pagination = graduatesData?.pagination;

  const handleSelectGraduate = (graduate: AvailableGraduate) => {
    setSelectedGraduate(graduate);
    setStep("confirm");
  };

  const handleConfirmAssignment = () => {
    if (!selectedGraduate) return;

    performAction(
      {
        requestId,
        action: "assign",
        data: {
          graduateDataId: selectedGraduate.id,
          notes: assignmentNotes || undefined,
        },
      },
      {
        onSuccess: () => {
          setSelectedGraduate(null);
          setAssignmentNotes("");
          setStep("select");
          onAssigned?.();
        },
      }
    );
  };

  const handleBack = () => {
    setSelectedGraduate(null);
    setStep("select");
  };

  const handleClose = () => {
    setSelectedGraduate(null);
    setAssignmentNotes("");
    setStep("select");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "select" ? "Assign Graduate" : "Confirm Assignment"}
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Select an available graduate to assign to this position"
              : "Review and confirm the assignment"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <>
            {/* Search and Filters */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or skills..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-8"
                />
              </div>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Graduates List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Loading graduates...
                  </p>
                </div>
              ) : graduates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2" />
                  <p>No available graduates found</p>
                  <p className="text-xs mt-1">
                    Graduates must be approved and not already assigned
                  </p>
                </div>
              ) : (
                graduates.map((graduate) => (
                  <Card
                    key={graduate.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSelectGraduate(graduate)}
                  >
                    <CardContent className="py-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {graduate.graduateFirstname} {graduate.graduateSurname}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {graduate.email}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {graduate.courseOfStudy} ({graduate.graduationYear})
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {graduate.nameOfZone}
                            </span>
                          </div>
                          {graduate.skillsPossessed && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              Skills: {graduate.skillsPossessed}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {graduate.graduateGender}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {step === "confirm" && selectedGraduate && (
          <div className="space-y-4">
            {/* Selected Graduate Info */}
            <Card className="border-primary">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium">Selected Graduate</span>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-lg">
                    {selectedGraduate.graduateFirstname}{" "}
                    {selectedGraduate.graduateSurname}
                  </p>
                  <p className="text-muted-foreground">{selectedGraduate.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">
                      {selectedGraduate.graduateGender}
                    </Badge>
                    <Badge variant="outline">
                      {selectedGraduate.nameOfUniversity}
                    </Badge>
                    <Badge variant="outline">
                      {selectedGraduate.courseOfStudy}
                    </Badge>
                  </div>
                  {selectedGraduate.skillsPossessed && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Skills:</p>
                      <p className="text-sm">{selectedGraduate.skillsPossessed}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Assignment Notes */}
            <div className="space-y-2">
              <Label htmlFor="assignmentNotes">Assignment Notes (optional)</Label>
              <Textarea
                id="assignmentNotes"
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                placeholder="Add any notes about this assignment..."
                rows={3}
              />
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              <p className="text-yellow-800">
                This action will assign the graduate to the requesting department
                and update their service status to &quot;Serving&quot;.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step === "select" ? (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleBack} disabled={isAssigning}>
                Back
              </Button>
              <Button onClick={handleConfirmAssignment} disabled={isAssigning}>
                {isAssigning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Confirm Assignment"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
