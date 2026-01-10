"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  Briefcase,
  Award,
  BookOpen,
  Heart,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  useStaffDetail,
  AssignedStaffDetail,
} from "@/hooks/use-assigned-staff";

interface StaffDetailModalProps {
  staffId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffDetailModal({
  staffId,
  open,
  onOpenChange,
}: StaffDetailModalProps) {
  const { data, isLoading, isError } = useStaffDetail(staffId);
  const staff = data?.staff;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { className: string; icon: typeof Clock }
    > = {
      "Under Review": { className: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Invited For Interview": {
        className: "bg-blue-100 text-blue-800",
        icon: Calendar,
      },
      Interviewed: {
        className: "bg-purple-100 text-purple-800",
        icon: CheckCircle,
      },
      Sighting: { className: "bg-orange-100 text-orange-800", icon: Clock },
      Serving: { className: "bg-green-100 text-green-800", icon: CheckCircle },
      "Not Accepted": { className: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || {
      className: "bg-gray-100 text-gray-800",
      icon: Clock,
    };

    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Staff Profile
          </DialogTitle>
          <DialogDescription>
            View detailed information about this VGSS staff member
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Loading staff details...</span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-12 text-red-500">
            <XCircle className="w-6 h-6 mr-2" />
            Failed to load staff details
          </div>
        ) : staff ? (
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Header with Photo and Basic Info */}
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  {staff.photo ? (
                    <AvatarImage src={staff.photo} alt={staff.graduateFirstname} />
                  ) : null}
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getInitials(staff.graduateFirstname, staff.graduateSurname)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {staff.graduateFirstname} {staff.graduateSurname}
                  </h2>
                  <p className="text-muted-foreground">
                    {staff.courseOfStudy} - {staff.nameOfUniversity}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {getStatusBadge(staff.status)}
                    <Badge variant="outline">
                      {staff.graduateGender}
                    </Badge>
                  </div>

                  {staff.serviceStartedDate && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Service started: {formatDate(staff.serviceStartedDate)}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                        {staff.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        {staff.graduatePhoneNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Home Address
                      </Label>
                      <p className="flex items-start">
                        <Home className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground" />
                        {staff.homeAddress || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        State of Origin
                      </Label>
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        {staff.stateOfOrigin || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Date of Birth
                      </Label>
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {formatDate(staff.dateOfBirth)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Place of Birth
                      </Label>
                      <p>{staff.placeOfBirth || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Marital Status
                      </Label>
                      <p className="flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-muted-foreground" />
                        {staff.maritalStatus || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education Information */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Education
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        University
                      </Label>
                      <p className="font-medium">{staff.nameOfUniversity || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Course of Study
                      </Label>
                      <p>{staff.courseOfStudy || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Graduation Year
                      </Label>
                      <p>{staff.graduationYear || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Grade</Label>
                      <p>{staff.grade || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        NYSC Status
                      </Label>
                      <Badge variant="outline">{staff.nyscStatus || "N/A"}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ministry Information */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Ministry Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Zone</Label>
                      <p className="font-medium">{staff.nameOfZone || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Chapter</Label>
                      <p>{staff.chapterName || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Zonal Pastor
                      </Label>
                      <p>{staff.nameOfZonalPastor || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Chapter Pastor
                      </Label>
                      <p>{staff.nameOfChapterPastor || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Experience */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Skills & Experience
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Skills Possessed
                      </Label>
                      <p className="bg-muted/50 p-3 rounded-lg text-sm">
                        {staff.skillsPossessed || "No skills listed"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Leadership Roles in Ministry/Fellowship
                      </Label>
                      <p className="bg-muted/50 p-3 rounded-lg text-sm">
                        {staff.leadershipRolesInMinistryAndFellowship ||
                          "No roles listed"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Ministry Programs Attended
                      </Label>
                      <p className="bg-muted/50 p-3 rounded-lg text-sm">
                        {staff.ministryProgramsAttended || "No programs listed"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accommodation Preferences */}
              {(staff.accommodation || staff.whereAccommodation) && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Home className="w-4 h-4 mr-2" />
                      Accommodation
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Has Accommodation?
                        </Label>
                        <p>{staff.accommodation || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Where?
                        </Label>
                        <p>{staff.whereAccommodation || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Type of Accommodation
                        </Label>
                        <p>{staff.kindAccommodation || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Preferred City of Posting
                        </Label>
                        <p>{staff.preferredCityOfPosting || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                {staff.email && (
                  <Button asChild>
                    <a href={`mailto:${staff.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                )}
                {staff.graduatePhoneNumber && (
                  <Button variant="secondary" asChild>
                    <a href={`tel:${staff.graduatePhoneNumber}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
