"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  GraduationCap,
  Home,
  Users,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  MessageSquare,
  Eye,
  EyeOff,
  Shield,
  Key,
} from "lucide-react";
import Link from "next/link";

interface GraduateRecord {
  id: string;
  graduateFirstname: string;
  graduateSurname: string;
  graduateGender: "MALE" | "FEMALE";
  nameOfUniversity: string;
  courseOfStudy: string;
  graduationYear: number;
  nameOfFellowship: string;
  nameOfZonalPastor: string;
  nameOfChapterPastor: string;
  phoneNumberOfChapterPastor: string;
  emailOfChapterPastor: string;
  isRegistered: boolean;
  zoneName: string;
}

interface RegistrationFormData {
  // Personal Information
  placeOfBirth: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  homeAddress: string;
  graduatePhoneNumber: string;
  email: string;
  maritalStatus: "SINGLE" | "MARRIED";

  // Posting Preferences
  preferredCityOfPosting: string;
  accommodation: string;
  whereAccommodation: string;
  kindAccommodation: string;
  contactOfPersonLivingWith: string;

  // Spiritual Journey
  whereWhenChrist: string;
  whereWhenHolyGhost: string;
  whereWhenBaptism: string;
  whereWhenFoundationSchool: string;
  hasCertificate: boolean;
  localAssemblyAfterGraduation: string;

  // Family Information
  fatherName: string;
  fatherPhoneNumber: string;
  fatherEmailAddress: string;
  fatherOccupation: string;
  nameOfFatherChurch: string;
  motherName: string;
  motherPhoneNumber: string;
  motherEmailAddress: string;
  motherOccupation: string;
  nameOfMotherChurch: string;
  howManyInFamily: string;
  whatPositionInFamily: string;
  familyResidence: string;
  parentsTogether: boolean;
  parentsAwareOfVgssIntention: boolean;

  // Education Information
  nameOfUniversity: string;
  courseOfStudy: string;
  graduationYear: string;
  grade: string;
  nyscStatus: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "EXEMPTED";

  // Skills and Experience
  skillsPossessed: string;
  leadershipRolesInMinistryAndFellowship: string;
  ministryProgramsAttended: string;

  // Test Questions
  visionMissionPurpose: string;
  explainWithExamples: string;
  partnershipArms: string;
  fullMeaning: string;
  variousTasksResponsibleFor: string;
  projectProudOfAndRolePlayed: string;
  exampleDifficultSituation: string;
  recentConflict: string;
  convictions: string;
  whyVgss: string;
  plansAfterVgss: string;

  // Password for account creation
  password: string;
  confirmPassword: string;
}

const initialFormData: RegistrationFormData = {
  placeOfBirth: "",
  dateOfBirth: "",
  stateOfOrigin: "",
  homeAddress: "",
  graduatePhoneNumber: "",
  email: "",
  maritalStatus: "SINGLE",
  preferredCityOfPosting: "",
  accommodation: "",
  whereAccommodation: "",
  kindAccommodation: "",
  contactOfPersonLivingWith: "",
  whereWhenChrist: "",
  whereWhenHolyGhost: "",
  whereWhenBaptism: "",
  whereWhenFoundationSchool: "",
  hasCertificate: false,
  localAssemblyAfterGraduation: "",
  fatherName: "",
  fatherPhoneNumber: "",
  fatherEmailAddress: "",
  fatherOccupation: "",
  nameOfFatherChurch: "",
  motherName: "",
  motherPhoneNumber: "",
  motherEmailAddress: "",
  motherOccupation: "",
  nameOfMotherChurch: "",
  howManyInFamily: "",
  whatPositionInFamily: "",
  familyResidence: "",
  parentsTogether: false,
  parentsAwareOfVgssIntention: false,
  nameOfUniversity: "",
  courseOfStudy: "",
  graduationYear: "",
  grade: "",
  nyscStatus: "NOT_STARTED",
  skillsPossessed: "",
  leadershipRolesInMinistryAndFellowship: "",
  ministryProgramsAttended: "",
  visionMissionPurpose: "",
  explainWithExamples: "",
  partnershipArms: "",
  fullMeaning: "",
  variousTasksResponsibleFor: "",
  projectProudOfAndRolePlayed: "",
  exampleDifficultSituation: "",
  recentConflict: "",
  convictions: "",
  whyVgss: "",
  plansAfterVgss: "",
  password: "",
  confirmPassword: "",
};

function GraduateRegisterForm() {
  const searchParams = useSearchParams();
  const recordId = searchParams.get("recordId");

  const [currentTab, setCurrentTab] = useState("personal");
  const [formData, setFormData] =
    useState<RegistrationFormData>(initialFormData);
  const [graduateRecord, setGraduateRecord] = useState<GraduateRecord | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User, fields: 8 },
    { id: "posting", label: "Posting Preferences", icon: MapPin, fields: 5 },
    { id: "spiritual", label: "Spiritual Journey", icon: BookOpen, fields: 6 },
    { id: "family", label: "Family Info", icon: Users, fields: 14 },
    { id: "education", label: "Education", icon: GraduationCap, fields: 5 },
    { id: "skills", label: "Skills & Experience", icon: User, fields: 3 },
    { id: "test", label: "Test Questions", icon: MessageSquare, fields: 11 },
    { id: "account", label: "Create Account", icon: Shield, fields: 2 },
  ];

  useEffect(() => {
    if (!recordId) {
      setError(
        "No graduate record selected. Please search for your record first."
      );
      return;
    }
    const fetchGraduateRecord = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/graduate/register?recordId=${recordId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch graduate record");
        }

        if (data.record.isRegistered) {
          setError("This record has already been registered by another user.");
          return;
        }

        setGraduateRecord(data.record);
      } catch (error) {
        console.error("Error fetching graduate record:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch graduate record"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraduateRecord();
  }, [recordId]);

  const updateFormData = (field: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getCompletionPercentage = () => {
    const totalFields = tabs.reduce((sum, tab) => sum + tab.fields, 0);
    const completedFields = Object.entries(formData).filter(([key, value]) => {
      if (typeof value === "boolean") return true;
      if (typeof value === "string") return value.trim() !== "";
      return false;
    }).length;
    return Math.round((completedFields / totalFields) * 100);
  };

  const validateCurrentTab = (): boolean => {
    switch (currentTab) {
      case "personal":
        return !!(
          formData.placeOfBirth &&
          formData.dateOfBirth &&
          formData.stateOfOrigin &&
          formData.homeAddress &&
          formData.graduatePhoneNumber &&
          formData.email
        );
      case "posting":
        return !!formData.preferredCityOfPosting;
      case "spiritual":
        return !!(
          formData.whereWhenChrist &&
          formData.whereWhenHolyGhost &&
          formData.whereWhenBaptism &&
          formData.whereWhenFoundationSchool
        );
      case "family":
        return !!(
          formData.fatherName &&
          formData.motherName &&
          formData.howManyInFamily &&
          formData.whatPositionInFamily &&
          formData.familyResidence
        );
      case "education":
        // Only validate grade - other fields are readonly from graduateRecord
        return !!formData.grade;
      case "test":
        return !!(
          formData.visionMissionPurpose &&
          formData.explainWithExamples &&
          formData.partnershipArms &&
          formData.fullMeaning &&
          formData.variousTasksResponsibleFor &&
          formData.projectProudOfAndRolePlayed &&
          formData.exampleDifficultSituation &&
          formData.recentConflict &&
          formData.convictions &&
          formData.whyVgss &&
          formData.plansAfterVgss
        );
      case "account":
        return !!(
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.password.length >= 6
        );
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentTab()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/graduate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 15000);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error instanceof Error ? error.message : "Failed to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentTabIndex = () =>
    tabs.findIndex((tab) => tab.id === currentTab);
  const isLastTab = getCurrentTabIndex() === tabs.length - 1;
  const isFirstTab = getCurrentTabIndex() === 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading graduate record...</p>
        </div>
      </div>
    );
  }

  if (error && !graduateRecord) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              Unable to Load Record
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/graduate/search">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              Registration Successful!
            </h2>
            <p className="text-muted-foreground mb-4">
              Your VGSS registration has been completed successfully. You will
              be redirected to login.
            </p>
            <Link href="/auth/login">
              <Button>Continue to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/graduate/search">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  VGSS Registration
                </h1>
                <p className="text-xs text-muted-foreground">
                  Complete your profile
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              {getCompletionPercentage()}% Complete
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Registration Progress</span>
              <span className="text-sm text-muted-foreground">
                {getCompletionPercentage()}% Complete
              </span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </div>

          {/* Graduate Record Summary */}
          {graduateRecord && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Your Graduate Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p>
                      <strong>First Name:</strong>{" "}
                      {graduateRecord.graduateFirstname}
                    </p>
                    <p>
                      <strong>Surname:</strong> {graduateRecord.graduateSurname}
                    </p>
                    <p>
                      <strong>Gender:</strong> {graduateRecord.graduateGender}
                    </p>
                    <p>
                      <strong>School:</strong> {graduateRecord.nameOfUniversity}
                    </p>
                    <p>
                      <strong>Course:</strong> {graduateRecord.courseOfStudy}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Zone:</strong> {graduateRecord.zoneName}
                    </p>
                    <p>
                      <strong>Fellowship:</strong>{" "}
                      {graduateRecord.nameOfFellowship}
                    </p>
                    <p>
                      <strong>Zonal Pastor:</strong>{" "}
                      {graduateRecord.nameOfZonalPastor}
                    </p>
                    <p>
                      <strong>Chapter Pastor:</strong>{" "}
                      {graduateRecord.nameOfChapterPastor}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Registration Form */}
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4  gap-1 h-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-1 text-xs lg:text-sm"
                  >
                    <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Provide your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                    <Input
                      id="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={(e) =>
                        updateFormData("placeOfBirth", e.target.value)
                      }
                      placeholder="Enter place of birth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        updateFormData("dateOfBirth", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stateOfOrigin">State of Origin *</Label>
                    <Input
                      id="stateOfOrigin"
                      value={formData.stateOfOrigin}
                      onChange={(e) =>
                        updateFormData("stateOfOrigin", e.target.value)
                      }
                      placeholder="Enter state of origin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status *</Label>
                    <Select
                      value={formData.maritalStatus}
                      onValueChange={(value) =>
                        updateFormData("maritalStatus", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="MARRIED">Married</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="homeAddress">Home Address *</Label>
                    <Textarea
                      id="homeAddress"
                      value={formData.homeAddress}
                      onChange={(e) =>
                        updateFormData("homeAddress", e.target.value)
                      }
                      placeholder="Enter your complete home address"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduatePhoneNumber">Phone Number *</Label>
                    <Input
                      id="graduatePhoneNumber"
                      type="tel"
                      value={formData.graduatePhoneNumber}
                      onChange={(e) =>
                        updateFormData("graduatePhoneNumber", e.target.value)
                      }
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Creation Tab */}
            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Create Your Account
                  </CardTitle>
                  <CardDescription>
                    Set up your login credentials for the VGSS platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          updateFormData("password", e.target.value)
                        }
                        placeholder="Choose a strong password (min. 6 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          updateFormData("confirmPassword", e.target.value)
                        }
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-600">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Posting Preferences Tab */}
            <TabsContent value="posting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Posting Preferences
                  </CardTitle>
                  <CardDescription>
                    Your preferred location and accommodation details
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="preferredCityOfPosting">
                      Preferred City of Posting *
                    </Label>
                    <Input
                      id="preferredCityOfPosting"
                      value={formData.preferredCityOfPosting}
                      onChange={(e) =>
                        updateFormData("preferredCityOfPosting", e.target.value)
                      }
                      placeholder="Enter preferred city"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accommodation">
                      Do you have Accommodation in Prefered City of Posting
                    </Label>
                    <Select
                      value={formData.accommodation}
                      onValueChange={(value) =>
                        updateFormData("accommodation", value)
                      }
                    >
                      <SelectTrigger className=" w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES">YES</SelectItem>
                        <SelectItem value="NO">NO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="whereAccommodation">
                      Where do you have accommodation
                    </Label>
                    <Textarea
                      id="whereAccommodation"
                      value={formData.whereAccommodation}
                      onChange={(e) =>
                        updateFormData("whereAccommodation", e.target.value)
                      }
                      placeholder="Provide details of your accommodation arrangement"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kindAccommodation">
                      Address / Nearest Bus stop
                    </Label>
                    <Input
                      id="kindAccommodation"
                      value={formData.kindAccommodation}
                      onChange={(e) =>
                        updateFormData("kindAccommodation", e.target.value)
                      }
                      placeholder="Enter your accommodation address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactOfPersonLivingWith">
                      Contact of Person Living With
                    </Label>
                    <Input
                      id="contactOfPersonLivingWith"
                      type="tel"
                      value={formData.contactOfPersonLivingWith}
                      onChange={(e) =>
                        updateFormData(
                          "contactOfPersonLivingWith",
                          e.target.value
                        )
                      }
                      placeholder="Phone number if staying with someone"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Spiritual Journey Tab */}
            <TabsContent value="spiritual" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Ministry Information
                  </CardTitle>
                  <CardDescription>
                    Share your spiritual experiences and foundation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="">Name of Zone</Label>
                    <Input readOnly={true} value={graduateRecord?.zoneName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="">Name of Fellowship</Label>
                    <Input
                      readOnly={true}
                      value={graduateRecord?.nameOfFellowship}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whereWhenChrist">
                      Where and when did you receive Christ? *
                    </Label>
                    <Textarea
                      id="whereWhenChrist"
                      value={formData.whereWhenChrist}
                      onChange={(e) =>
                        updateFormData("whereWhenChrist", e.target.value)
                      }
                      placeholder="Describe where and when you became born again"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whereWhenHolyGhost">
                      Where and when did you receive the Holy Ghost? *
                    </Label>
                    <Textarea
                      id="whereWhenHolyGhost"
                      value={formData.whereWhenHolyGhost}
                      onChange={(e) =>
                        updateFormData("whereWhenHolyGhost", e.target.value)
                      }
                      placeholder="Describe your Holy Spirit baptism experience"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whereWhenBaptism">
                      Where and when were you baptized by immersion? *
                    </Label>
                    <Textarea
                      id="whereWhenBaptism"
                      value={formData.whereWhenBaptism}
                      onChange={(e) =>
                        updateFormData("whereWhenBaptism", e.target.value)
                      }
                      placeholder="Describe your water baptism"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whereWhenFoundationSchool">
                      Where and when did you attend Foundation School? *
                    </Label>
                    <Textarea
                      id="whereWhenFoundationSchool"
                      value={formData.whereWhenFoundationSchool}
                      onChange={(e) =>
                        updateFormData(
                          "whereWhenFoundationSchool",
                          e.target.value
                        )
                      }
                      placeholder="Provide details of your Foundation School attendance"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2 my-6">
                    <Checkbox
                      id="hasCertificate"
                      checked={formData.hasCertificate}
                      onCheckedChange={(checked) =>
                        updateFormData("hasCertificate", checked)
                      }
                    />
                    <Label htmlFor="hasCertificate">
                      I have my Foundation School certificate
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="localAssemblyAfterGraduation">
                      Local Assembly after graduation
                    </Label>
                    <Input
                      id="localAssemblyAfterGraduation"
                      value={formData.localAssemblyAfterGraduation}
                      onChange={(e) =>
                        updateFormData(
                          "localAssemblyAfterGraduation",
                          e.target.value
                        )
                      }
                      placeholder="Which church do you currently attend?"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Family Information Tab */}
            <TabsContent value="family" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Family Information
                  </CardTitle>
                  <CardDescription>
                    Information about your parents and family
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* {`Father's`} Information */}
                  <div>
                    <h4 className="font-medium mb-4">
                      {`Father's`} Information
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fatherName">{`Father's`} Name *</Label>
                        <Input
                          id="fatherName"
                          value={formData.fatherName}
                          onChange={(e) =>
                            updateFormData("fatherName", e.target.value)
                          }
                          placeholder="Enter your father's full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fatherPhoneNumber">
                          {`Father's`} Phone Number *
                        </Label>
                        <Input
                          id="fatherPhoneNumber"
                          type="tel"
                          value={formData.fatherPhoneNumber}
                          onChange={(e) =>
                            updateFormData("fatherPhoneNumber", e.target.value)
                          }
                          placeholder="+234 XXX XXX XXXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fatherEmailAddress">
                          {`Father's`} Email Address
                        </Label>
                        <Input
                          id="fatherEmailAddress"
                          type="email"
                          value={formData.fatherEmailAddress}
                          onChange={(e) =>
                            updateFormData("fatherEmailAddress", e.target.value)
                          }
                          placeholder="father@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fatherOccupation">
                          {`Father's`} Occupation *
                        </Label>
                        <Input
                          id="fatherOccupation"
                          value={formData.fatherOccupation}
                          onChange={(e) =>
                            updateFormData("fatherOccupation", e.target.value)
                          }
                          placeholder="Enter your father's occupation"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="nameOfFatherChurch">
                          {`Father's`} Church
                        </Label>
                        <Input
                          id="nameOfFatherChurch"
                          value={formData.nameOfFatherChurch}
                          onChange={(e) =>
                            updateFormData("nameOfFatherChurch", e.target.value)
                          }
                          placeholder="Which church does your father attend?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* {`Mother's`} Information */}
                  <div>
                    <h4 className="font-medium mb-4">
                      {`Mother's`} Information
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="motherName">{`Mother's`} Name *</Label>
                        <Input
                          id="motherName"
                          value={formData.motherName}
                          onChange={(e) =>
                            updateFormData("motherName", e.target.value)
                          }
                          placeholder="Enter mother's full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motherPhoneNumber">
                          {`Mother's`} Phone Number *
                        </Label>
                        <Input
                          id="motherPhoneNumber"
                          type="tel"
                          value={formData.motherPhoneNumber}
                          onChange={(e) =>
                            updateFormData("motherPhoneNumber", e.target.value)
                          }
                          placeholder="+234 XXX XXX XXXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motherEmailAddress">
                          {`Mother's`} Email Address
                        </Label>
                        <Input
                          id="motherEmailAddress"
                          type="email"
                          value={formData.motherEmailAddress}
                          onChange={(e) =>
                            updateFormData("motherEmailAddress", e.target.value)
                          }
                          placeholder="mother@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motherOccupation">
                          {`Mother's`} Occupation *
                        </Label>
                        <Input
                          id="motherOccupation"
                          value={formData.motherOccupation}
                          onChange={(e) =>
                            updateFormData("motherOccupation", e.target.value)
                          }
                          placeholder="Enter mother's occupation"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="nameOfMotherChurch">
                          {`Mother's`} Church
                        </Label>
                        <Input
                          id="nameOfMotherChurch"
                          value={formData.nameOfMotherChurch}
                          onChange={(e) =>
                            updateFormData("nameOfMotherChurch", e.target.value)
                          }
                          placeholder="Which church does your mother attend?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Family Details */}
                  <div>
                    <h4 className="font-medium mb-4">Family Details</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="howManyInFamily">
                          How many are you in the family? *
                        </Label>
                        <Input
                          id="howManyInFamily"
                          type="number"
                          min="1"
                          value={formData.howManyInFamily}
                          onChange={(e) =>
                            updateFormData("howManyInFamily", e.target.value)
                          }
                          placeholder="Enter total number of children"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatPositionInFamily">
                          What position are you in the family? *
                        </Label>
                        <Input
                          id="whatPositionInFamily"
                          type="number"
                          min="1"
                          value={formData.whatPositionInFamily}
                          onChange={(e) =>
                            updateFormData(
                              "whatPositionInFamily",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 1 for first child, 2 for second"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="familyResidence">
                          Family Residence *
                        </Label>
                        <Textarea
                          id="familyResidence"
                          value={formData.familyResidence}
                          onChange={(e) =>
                            updateFormData("familyResidence", e.target.value)
                          }
                          placeholder="Enter your family's complete address"
                          rows={3}
                        />
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="parentsTogether"
                            checked={formData.parentsTogether}
                            onCheckedChange={(checked) =>
                              updateFormData("parentsTogether", checked)
                            }
                          />
                          <Label htmlFor="parentsTogether">
                            My parents are together
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="parentsAwareOfVgssIntention"
                            checked={formData.parentsAwareOfVgssIntention}
                            onCheckedChange={(checked) =>
                              updateFormData(
                                "parentsAwareOfVgssIntention",
                                checked
                              )
                            }
                          />
                          <Label htmlFor="parentsAwareOfVgssIntention">
                            My parents are aware of my intention to join VGSS
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Information Tab */}
            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Education Information
                  </CardTitle>
                  <CardDescription>
                    Your university education and NYSC details
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nameOfUniversity">
                      Name of University *
                    </Label>
                    <Input
                      id="nameOfUniversity"
                      readOnly={true}
                      value={graduateRecord?.nameOfUniversity}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseOfStudy">Course of Study *</Label>
                    <Input
                      id="courseOfStudy"
                      value={graduateRecord?.courseOfStudy}
                      readOnly={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year *</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      min="2000"
                      value={graduateRecord?.graduationYear}
                      readOnly={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Class of Degree *</Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) => updateFormData("grade", value)}
                    >
                      <SelectTrigger className=" w-full">
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIRST_CLASS">First Class</SelectItem>
                        <SelectItem value="SECOND_CLASS_UPPER">
                          Second Class Upper
                        </SelectItem>
                        <SelectItem value="SECOND_CLASS_LOWER">
                          Second Class Lower
                        </SelectItem>
                        <SelectItem value="THIRD_CLASS">Third Class</SelectItem>
                        <SelectItem value="PASS">Pass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nyscStatus">NYSC Status *</Label>
                    <Select
                      value={formData.nyscStatus}
                      onValueChange={(value) =>
                        updateFormData("nyscStatus", value)
                      }
                    >
                      <SelectTrigger className=" w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                        <SelectItem value="EXEMPTED">Exempted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills and Experience Tab */}
            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Skills & Experience
                  </CardTitle>
                  <CardDescription>
                    Share your skills, leadership experience, and ministry
                    involvement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="skillsPossessed">Skills Possessed</Label>
                    <Textarea
                      id="skillsPossessed"
                      value={formData.skillsPossessed}
                      onChange={(e) =>
                        updateFormData("skillsPossessed", e.target.value)
                      }
                      placeholder="List your skills, talents, and areas of expertise"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leadershipRolesInMinistryAndFellowship">
                      Leadership Roles in Ministry and in your Fellowship
                    </Label>
                    <Textarea
                      id="leadershipRolesInMinistryAndFellowship"
                      value={formData.leadershipRolesInMinistryAndFellowship}
                      onChange={(e) =>
                        updateFormData(
                          "leadershipRolesInMinistryAndFellowship",
                          e.target.value
                        )
                      }
                      placeholder="Describe any leadership positions you've held in church or fellowship"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ministryProgramsAttended">
                      Ministry Programs Attended in the last Year
                    </Label>
                    <Textarea
                      id="ministryProgramsAttended"
                      value={formData.ministryProgramsAttended}
                      onChange={(e) =>
                        updateFormData(
                          "ministryProgramsAttended",
                          e.target.value
                        )
                      }
                      placeholder="List ministry programs, conferences, and training you attended in the last year"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Test Questions Tab */}
            <TabsContent value="test" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Test Questions
                  </CardTitle>
                  <CardDescription>
                    Kindly provide answers to all the Questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="visionMissionPurpose">
                      1. (a) What is the Vision, Mission, and Purpose of the
                      Loveworld Incorporated?
                    </Label>
                    <Label>
                      (b) What does the vision mean to you, how does it affect
                      you as an intending VGSS staff of the Ministry.
                    </Label>
                    <Label>
                      (c) Why do you want to work as a VGSS staff in the
                      Ministry?
                    </Label>

                    <Textarea
                      id="visionMissionPurpose"
                      value={formData.visionMissionPurpose}
                      onChange={(e) =>
                        updateFormData("visionMissionPurpose", e.target.value)
                      }
                      placeholder="Enter your answers here"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="explainWithExamples">
                      2. Briefly explain the following citing practical
                      examples:
                    </Label>
                    <Label htmlFor="explainWithExamples">(a) Work Ethics</Label>
                    <Label htmlFor="explainWithExamples">
                      (b) Managing sacred Funds
                    </Label>
                    <Label htmlFor="explainWithExamples">(c) Team Work</Label>
                    <Label htmlFor="explainWithExamples">
                      (d) Efficiency and Effectiveness{" "}
                    </Label>

                    <Textarea
                      id="explainWithExamples"
                      value={formData.explainWithExamples}
                      onChange={(e) =>
                        updateFormData("explainWithExamples", e.target.value)
                      }
                      placeholder="Provide detailed explanation with practical examples"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnershipArms">
                      3. (a) List 5 Partnership arms of the Ministry
                    </Label>
                    <Label htmlFor="partnershipArms">
                      (b) Mention five (5) Ministry Departments you know.
                    </Label>
                    <Label htmlFor="partnershipArms">
                      (c) What was your cumulative partnership for the last 12
                      months?
                    </Label>
                    <Textarea
                      id="partnershipArms"
                      value={formData.partnershipArms}
                      onChange={(e) =>
                        updateFormData("partnershipArms", e.target.value)
                      }
                      placeholder="List and briefly explain"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullMeaning">
                      4. What is the full meaning of the following acronyms?
                    </Label>
                    <Label htmlFor="fullMeaning">(a) GSCC and VGSS?</Label>
                    <Label htmlFor="fullMeaning">(b) What does CEC mean?</Label>
                    <Label htmlFor="fullMeaning">
                      (c) List the names of the CEC Members we have in the
                      Ministry.
                    </Label>
                    <Label htmlFor="fullMeaning">
                      (d) What are the names of the Secretary General, CEO and
                      COO of the Ministry?
                    </Label>
                    <Textarea
                      id="fullMeaning"
                      value={formData.fullMeaning}
                      onChange={(e) =>
                        updateFormData("fullMeaning", e.target.value)
                      }
                      placeholder="Provide the full meaning of the acronyms"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variousTasksResponsibleFor">
                      5 List the Various tasks you have been responsible for in
                      Campus Ministry.
                    </Label>
                    <Textarea
                      id="variousTasksResponsibleFor"
                      value={formData.variousTasksResponsibleFor}
                      onChange={(e) =>
                        updateFormData(
                          "variousTasksResponsibleFor",
                          e.target.value
                        )
                      }
                      placeholder="Describe your roles and responsibilities in your local church"
                      rows={4}
                    />
                  </div>
                  <div>PROJECT QUESTIONS</div>
                  <div className="space-y-2">
                    <Label htmlFor="projectProudOfAndRolePlayed">
                      6. What Project you were particularly proud of and the
                      role you played in its success?
                    </Label>
                    <Textarea
                      id="projectProudOfAndRolePlayed"
                      value={formData.projectProudOfAndRolePlayed}
                      onChange={(e) =>
                        updateFormData(
                          "projectProudOfAndRolePlayed",
                          e.target.value
                        )
                      }
                      placeholder="Describe a meaningful project and your specific contribution"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exampleDifficultSituation">
                      7. Give an example of time when you had to deal with a
                      seemly difficult situation?
                    </Label>
                    <Textarea
                      id="exampleDifficultSituation"
                      value={formData.exampleDifficultSituation}
                      onChange={(e) =>
                        updateFormData(
                          "exampleDifficultSituation",
                          e.target.value
                        )
                      }
                      placeholder="Share a challenging situation and your approach to resolving it"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recentConflict">
                      8. How did you handle a recent conflict situation?
                    </Label>
                    <Textarea
                      id="recentConflict"
                      value={formData.recentConflict}
                      onChange={(e) =>
                        updateFormData("recentConflict", e.target.value)
                      }
                      placeholder="Explain a recent conflict and the steps you took to resolve it"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="convictions">
                      9. What are your convictions? *
                    </Label>
                    <Textarea
                      id="convictions"
                      value={formData.convictions}
                      onChange={(e) =>
                        updateFormData("convictions", e.target.value)
                      }
                      placeholder="Share your core beliefs and principles"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whyVgss">
                      10. Why do you want to join VGSS? *
                    </Label>
                    <Textarea
                      id="whyVgss"
                      value={formData.whyVgss}
                      onChange={(e) =>
                        updateFormData("whyVgss", e.target.value)
                      }
                      placeholder="Explain your motivation for joining the Volunteer Graduate Service Scheme"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plansAfterVgss">
                      11. What are your plans after VGSS? *
                    </Label>
                    <Textarea
                      id="plansAfterVgss"
                      value={formData.plansAfterVgss}
                      onChange={(e) =>
                        updateFormData("plansAfterVgss", e.target.value)
                      }
                      placeholder="Describe your plans and goals after completing your VGSS service year"
                      rows={4}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Important Notes
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• ALL questions are required for registration</li>
                      <li>• Please provide thoughtful and detailed answers</li>
                      <li>
                        • Your responses will be reviewed by the VGSS Office
                      </li>
                      <li>• Be honest and authentic in your answers</li>
                      <li>
                        • Incomplete answers may result in registration
                        rejection
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = getCurrentTabIndex();
                if (currentIndex > 0) {
                  setCurrentTab(tabs[currentIndex - 1].id);
                }
              }}
              disabled={isFirstTab || isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-4">
              {!isLastTab ? (
                <Button
                  onClick={() => {
                    if (validateCurrentTab()) {
                      const currentIndex = getCurrentTabIndex();
                      setCurrentTab(tabs[currentIndex + 1].id);
                      setError("");
                    } else {
                      setError(
                        "Please fill in all required fields before continuing"
                      );
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !validateCurrentTab()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Complete Registration
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          <div className=" mt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the form in Suspense
export default function GraduateRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <GraduateRegisterForm />
    </Suspense>
  );
}
