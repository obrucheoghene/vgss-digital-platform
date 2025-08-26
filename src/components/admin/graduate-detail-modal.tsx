// src/components/admin/graduate-detail-modal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  GraduationCap,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Heart,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Eye,
  Star,
  FileText,
  AlertTriangle,
  Loader2,
  Home,
  Briefcase,
  Globe,
  Target,
  Lightbulb,
  HelpCircle,
  UserCheck,
  School,
  Church,
} from "lucide-react";
import {
  useGraduate,
  useGraduateActions,
  type Graduate,
} from "@/hooks/use-graduate-management";
import { cn } from "@/lib/utils";

interface GraduateDetailModalProps {
  graduate: Graduate | null;
  isOpen: boolean;
  onClose: () => void;
  onGraduateUpdated: (updatedGraduate: Graduate) => void;
}

export function GraduateDetailModal({
  graduate,
  isOpen,
  onClose,
  onGraduateUpdated,
}: GraduateDetailModalProps) {
  const [comments, setComments] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState("");

  // Fetch detailed graduate data
  const {
    data: graduateDetails,
    isLoading,
    error: fetchError,
  } = useGraduate(graduate?.id);
  const graduateActions = useGraduateActions();

  // Reset state when graduate changes or modal opens/closes
  useEffect(() => {
    if (graduate && isOpen) {
      setComments("");
      setSelectedStatus(graduate.status);
      setError("");
    }
  }, [graduate, isOpen]);

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      setError(fetchError.message);
    }
  }, [fetchError]);

  if (!graduate) return null;

  const detailedGraduate = graduateDetails?.graduate;

  const statusOptions = [
    {
      value: "Under Review",
      label: "Under Review",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      value: "Invited For Interview",
      label: "Invited For Interview",
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      value: "Interviewed",
      label: "Interviewed",
      icon: CheckCircle,
      color: "text-purple-600",
    },
    {
      value: "Sighting",
      label: "Sighting",
      icon: Eye,
      color: "text-orange-600",
    },
    {
      value: "Serving",
      label: "Serving",
      icon: Award,
      color: "text-green-600",
    },
    {
      value: "Not Accepted",
      label: "Not Accepted",
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  const handleAction = async (action: string, data?: any) => {
    setError("");

    try {
      graduateActions.mutate(
        { graduateId: graduate.id, action, data },
        {
          onSuccess: (result) => {
            onGraduateUpdated(result.graduate);
            if (action === "approve" || action === "reject") {
              onClose();
            }
          },
          onError: (error: Error) => {
            setError(error.message);
          },
        }
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleStatusUpdate = () => {
    if (selectedStatus === graduate.status && !comments.trim()) return;

    handleAction("update_status", {
      status: selectedStatus,
      comments: comments.trim() || undefined,
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find((s) => s.value === status);
    if (!statusConfig) return null;

    const Icon = statusConfig.icon;
    return (
      <Badge variant="outline" className="flex items-center">
        <Icon className={`w-3 h-3 mr-1 ${statusConfig.color}`} />
        {status}
      </Badge>
    );
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInDays = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold flex items-center space-x-3">
                  <span>{graduate.graduateName}</span>
                  {graduate.isApproved && (
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  )}
                </DialogTitle>
                <DialogDescription className="flex items-center space-x-3 mt-2">
                  {getStatusBadge(graduate.status)}
                  <Badge
                    variant={
                      graduate.graduateGender === "MALE"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {graduate.graduateGender}
                  </Badge>
                  {detailedGraduate && (
                    <Badge variant="outline">
                      Age {calculateAge(detailedGraduate.dateOfBirth)}
                    </Badge>
                  )}
                  <Badge variant="outline">
                    Applied {formatTimeAgo(graduate.createdAt)}
                  </Badge>
                </DialogDescription>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              {!graduate.isApproved && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve Graduate</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve{" "}
                          {graduate.graduateName} for VGSS service? This action
                          will mark them as eligible for ministry placement.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleAction("approve")}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={graduateActions.isPending}
                        >
                          {graduateActions.isPending && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Approve Graduate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Graduate</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject{" "}
                          {graduate.graduateName}'s application? This will mark
                          them as "Not Accepted" and they will not be eligible
                          for service.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleAction("reject", {
                              comments: "Application rejected by VGSS Office",
                            })
                          }
                          className="bg-red-600 hover:bg-red-700"
                          disabled={graduateActions.isPending}
                        >
                          {graduateActions.isPending && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Reject Application
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="flex-shrink-0">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-6 flex-shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="ministry">Ministry</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 overflow-auto mt-4">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-full mb-1" />
                            <Skeleton className="h-4 w-3/4" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : detailedGraduate ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Personal Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Personal Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-3">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Zone
                              </Label>
                              <p className="text-lg font-semibold mt-1">
                                {detailedGraduate.nameOfZone}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Fellowship
                              </Label>
                              <p className="text-base mt-1">
                                {detailedGraduate.nameOfFellowship}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Zonal Pastor
                              </Label>
                              <p className="text-base mt-1">
                                {detailedGraduate.nameOfZonalPastor}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Chapter Pastor
                              </Label>
                              <p className="text-base mt-1">
                                {detailedGraduate.nameOfChapterPastor}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Pastor's Phone
                              </Label>
                              <p className="text-base flex items-center mt-1">
                                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                {detailedGraduate.phoneNumberOfChapterPastor}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                Pastor's Email
                              </Label>
                              <p className="text-base flex items-center mt-1">
                                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                                {detailedGraduate.emailOfChapterPastor}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Heart className="w-5 h-5 mr-2" />
                            Spiritual Journey
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              When & Where You Gave Your Life to Christ
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.whereWhenChrist}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              When & Where You Received the Holy Ghost
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.whereWhenHolyGhost}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              When & Where You Were Baptized
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.whereWhenBaptism}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Foundation School Experience
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.whereWhenFoundationSchool}
                            </p>
                          </div>
                          {detailedGraduate.hasCertificate && (
                            <div>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Has Foundation School Certificate
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ) : null}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Family Tab */}
            <TabsContent value="family" className="flex-1 overflow-auto mt-4">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : detailedGraduate ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Family Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          <div className="grid gap-8 md:grid-cols-2">
                            {/* Father's Information */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-lg border-b pb-2">
                                {`Father's`} Information
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Name
                                  </Label>
                                  <p className="text-base font-medium mt-1">
                                    {detailedGraduate.fatherName}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Phone
                                  </Label>
                                  <p className="text-base flex items-center mt-1">
                                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                    {detailedGraduate.fatherPhoneNumber}
                                  </p>
                                </div>
                                {detailedGraduate.fatherEmailAddress && (
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Email
                                    </Label>
                                    <p className="text-base flex items-center mt-1">
                                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                                      {detailedGraduate.fatherEmailAddress}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Occupation
                                  </Label>
                                  <p className="text-base mt-1">
                                    {detailedGraduate.fatherOccupation}
                                  </p>
                                </div>
                                {detailedGraduate.nameOfFatherChurch && (
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Church
                                    </Label>
                                    <p className="text-base mt-1">
                                      {detailedGraduate.nameOfFatherChurch}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Mother's Information */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-lg border-b pb-2">
                                {`Mother's`} Information
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Name
                                  </Label>
                                  <p className="text-base font-medium mt-1">
                                    {detailedGraduate.motherName}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Phone
                                  </Label>
                                  <p className="text-base flex items-center mt-1">
                                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                    {detailedGraduate.motherPhoneNumber}
                                  </p>
                                </div>
                                {detailedGraduate.motherEmailAddress && (
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Email
                                    </Label>
                                    <p className="text-base flex items-center mt-1">
                                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                                      {detailedGraduate.motherEmailAddress}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">
                                    Occupation
                                  </Label>
                                  <p className="text-base mt-1">
                                    {detailedGraduate.motherOccupation}
                                  </p>
                                </div>
                                {detailedGraduate.nameOfMotherChurch && (
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Church
                                    </Label>
                                    <p className="text-base mt-1">
                                      {detailedGraduate.nameOfMotherChurch}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-6">
                            <h4 className="font-semibold text-lg mb-4">
                              Family Structure
                            </h4>
                            <div className="grid gap-6 md:grid-cols-3">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  Family Size
                                </Label>
                                <p className="text-lg font-bold mt-1">
                                  {detailedGraduate.howManyInFamily} members
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  Position in Family
                                </Label>
                                <p className="text-base mt-1">
                                  {detailedGraduate.whatPositionInFamily}
                                  {detailedGraduate.whatPositionInFamily === 1
                                    ? "st"
                                    : detailedGraduate.whatPositionInFamily ===
                                      2
                                    ? "nd"
                                    : detailedGraduate.whatPositionInFamily ===
                                      3
                                    ? "rd"
                                    : "th"}{" "}
                                  child
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  Family Residence
                                </Label>
                                <p className="text-base mt-1">
                                  {detailedGraduate.familyResidence}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-6">
                            <h4 className="font-semibold text-lg mb-4">
                              Family Status
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  Parents Together
                                </Label>
                                <div className="mt-1">
                                  <Badge
                                    variant={
                                      detailedGraduate.parentsTogether
                                        ? "outline"
                                        : "secondary"
                                    }
                                  >
                                    {detailedGraduate.parentsTogether
                                      ? "Yes"
                                      : "No"}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  Parents Aware of VGSS Intention
                                </Label>
                                <div className="mt-1">
                                  <Badge
                                    variant={
                                      detailedGraduate.parentsAwareOfVgssIntention
                                        ? "outline"
                                        : "secondary"
                                    }
                                  >
                                    {detailedGraduate.parentsAwareOfVgssIntention
                                      ? "Yes"
                                      : "No"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : null}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent
              value="questions"
              className="flex-1 overflow-auto mt-4"
            >
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-20 w-full" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : detailedGraduate ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Application Questions & Responses
                          </CardTitle>
                          <CardDescription>
                            Review the {`graduate's`} comprehensive responses to
                            application questions
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Vision, Mission & Purpose of Christ Embassy
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.visionMissionPurpose}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Explain with Examples
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.explainWithExamples}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Partnership Arms of the Ministry
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.partnershipArms}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Full Meaning and Significance
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.fullMeaning}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Briefcase className="w-5 h-5 mr-2" />
                            Experience & Responsibilities
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Various Tasks {`You've`} Been Responsible For
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.variousTasksResponsibleFor}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Project {`You're`} Proud Of and Role You Played
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.projectProudOfAndRolePlayed}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Lightbulb className="w-5 h-5 mr-2" />
                            Problem Solving & Conflict Resolution
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Example of Difficult Situation and How You Handled
                              It
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.exampleDifficultSituation}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Recent Conflict and How You Resolved It
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.recentConflict}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Target className="w-5 h-5 mr-2" />
                            Personal Convictions & Future Plans
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Your Convictions
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.convictions}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              Why Do You Want to Join VGSS?
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.whyVgss}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-primary">
                              What Are Your Plans After VGSS?
                            </Label>
                            <p className="text-base bg-muted/50 p-4 rounded-lg mt-2 leading-relaxed">
                              {detailedGraduate.plansAfterVgss}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : null}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Management Tab */}
            <TabsContent value="manage" className="flex-1 overflow-auto mt-4">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Status Management */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          Status Management
                        </CardTitle>
                        <CardDescription>
                          Update the {`graduate's`} application status and add
                          comments
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="status-select">Update Status</Label>
                          <Select
                            value={selectedStatus}
                            onValueChange={setSelectedStatus}
                            disabled={graduateActions.isPending}
                          >
                            <SelectTrigger id="status-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    <div className="flex items-center">
                                      <Icon
                                        className={`w-4 h-4 mr-2 ${option.color}`}
                                      />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="comments">Comments (Optional)</Label>
                          <Textarea
                            id="comments"
                            placeholder="Add comments about this status change or any observations..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            disabled={graduateActions.isPending}
                          />
                        </div>

                        <Button
                          onClick={handleStatusUpdate}
                          disabled={
                            graduateActions.isPending ||
                            (selectedStatus === graduate.status &&
                              !comments.trim())
                          }
                          className="w-full"
                        >
                          {graduateActions.isPending && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Update Status & Comments
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="w-5 h-5 mr-2" />
                          Quick Actions
                        </CardTitle>
                        <CardDescription>
                          Common workflow actions for graduate management
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Status-specific quick actions */}
                        {graduate.status === "Under Review" && (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() =>
                              handleAction("update_status", {
                                status: "Invited For Interview",
                                comments:
                                  "Invited for interview based on application review",
                              })
                            }
                            disabled={graduateActions.isPending}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Invite for Interview
                          </Button>
                        )}

                        {graduate.status === "Invited For Interview" && (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() =>
                              handleAction("update_status", {
                                status: "Interviewed",
                                comments: "Interview completed successfully",
                              })
                            }
                            disabled={graduateActions.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Interviewed
                          </Button>
                        )}

                        {graduate.status === "Interviewed" && (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() =>
                              handleAction("update_status", {
                                status: "Sighting",
                                comments:
                                  "Moved to sighting phase for ministry placement",
                              })
                            }
                            disabled={graduateActions.isPending}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Move to Sighting
                          </Button>
                        )}

                        {graduate.status === "Sighting" && (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => handleAction("start_service")}
                            disabled={graduateActions.isPending}
                          >
                            <Award className="w-4 h-4 mr-2" />
                            Start Service
                          </Button>
                        )}

                        {graduate.status === "Serving" &&
                          !graduate.serviceCompletedDate && (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleAction("complete_service")}
                              disabled={graduateActions.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete Service
                            </Button>
                          )}

                        {/* Separator */}
                        {!graduate.isApproved && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-medium mb-3">
                              Application Decision
                            </h4>
                            <div className="space-y-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button className="w-full bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve Graduate
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Approve Graduate
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will approve {graduate.graduateName}{" "}
                                      for VGSS service and mark them as eligible
                                      for ministry placement. This action
                                      confirms they meet all requirements.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleAction("approve")}
                                      className="bg-green-600 hover:bg-green-700"
                                      disabled={graduateActions.isPending}
                                    >
                                      Approve Graduate
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full text-red-600 border-red-200"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject Application
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Reject Application
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will reject {graduate.graduateName}
                                      {`'s`}
                                      application and mark them as{" "}
                                      {"Not Accepted"}. They will not be
                                      eligible for VGSS service. This decision
                                      should be based on thorough review.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleAction("reject", {
                                          comments:
                                            "Application rejected by VGSS Office after thorough review",
                                        })
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={graduateActions.isPending}
                                    >
                                      Reject Application
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        )}

                        {/* Information Panel */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Status Guidelines
                          </h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>
                              • <strong>Under Review:</strong> Initial
                              application assessment
                            </li>
                            <li>
                              • <strong>Interview:</strong> Invited for
                              interview process
                            </li>
                            <li>
                              • <strong>Interviewed:</strong> Interview
                              completed, awaiting placement
                            </li>
                            <li>
                              • <strong>Sighting:</strong> Ministry placement in
                              progress
                            </li>
                            <li>
                              • <strong>Serving:</strong> Active VGSS service
                            </li>
                            <li>
                              • <strong>Not Accepted:</strong> Application
                              declined
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            Last updated:{" "}
            {graduate.updatedAt
              ? new Date(graduate.updatedAt).toLocaleString()
              : "Never"}
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={graduateActions.isPending}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
