// src/app/graduate/search/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  GraduationCap,
  User,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Filter,
  Loader2,
  Building,
  Calendar,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface GraduateRecord {
  id: string;
  graduateFirstname: string;
  graduateSurname: string;
  graduateGender: "MALE" | "FEMALE";
  nameOfUniversity: string;
  courseOfStudy: string;
  graduationYear: number;
  graduatePhoneNumber: string;
  nameOfFellowship: string;
  nameOfZonalPastor: string;
  nameOfChapterPastor: string;
  phoneNumberOfChapterPastor: string;
  emailOfChapterPastor: string;
  isRegistered: boolean;
  registeredAt?: string;
  createdAt: string;
  zoneName?: string;
}

interface ZoneData {
  id: string;
  name: string;
}

const SearchValues = z.object({
  surname: z.string().trim().min(1, "Surname is required"),
  zone: z.string().min(1, "Zone is required"),
  gender: z.enum(["MALE", "FEMALE"], "Gender is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+\d+$/,
      "Phone number must begin with your country code and contain only digits"
    ),
});

function GraduateSearchForm() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GraduateRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [zones, setZones] = useState<ZoneData[]>([]);

  type SearchType = z.infer<typeof SearchValues>;

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SearchType>({
    resolver: zodResolver(SearchValues),
    defaultValues: {
      surname: initialQuery,
      zone: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch("/api/blw-zone");
        const data = await response.json();
        if (data && data.success) setZones(data.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchZones();
  }, []);

  const performSearch: SubmitHandler<SearchType> = async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/graduate/search?q=${encodeURIComponent(values.surname)}&surname=${
          values.surname
        }&gender=${values.gender}&zone=${values.zone}&phoneNumber=${
          values.phoneNumber
        }`
      );
      const data = await response.json();
      setHasSearched(true);
      if (data && data.success) {
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Graduate Search
                  </h1>
                  <p className="text-xs text-gray-500">Find your VGSS record</p>
                </div>
              </div>
            </div>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Graduate Records
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find your graduate information that was uploaded by your BLW Zone.
              Once found, you can proceed with your VGSS registration.
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8 shadow-sm">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="flex items-center text-gray-900">
                <Search className="w-5 h-5 mr-2 text-primary" />
                Search Criteria
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your details to find your graduate record
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form
                onSubmit={handleSubmit(performSearch)}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Zone Selection */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="zone"
                      className="text-sm font-medium text-gray-700"
                    >
                      BLW Zone *
                    </Label>
                    <Select
                      value={watch("zone")}
                      onValueChange={(value) => setValue("zone", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select your zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.zone && (
                      <p className="text-sm text-red-600">
                        {errors.zone.message}
                      </p>
                    )}
                  </div>

                  {/* Surname */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="surname"
                      className="text-sm font-medium text-gray-700"
                    >
                      Surname *
                    </Label>
                    <Input
                      id="surname"
                      {...register("surname")}
                      placeholder="Enter your surname"
                      disabled={isSubmitting}
                      className="h-11"
                    />
                    {errors.surname && (
                      <p className="text-sm text-red-600">
                        {errors.surname.message}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Gender *
                    </Label>
                    <Select
                      value={watch("gender")}
                      onValueChange={(value: "MALE" | "FEMALE") =>
                        setValue("gender", value)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-red-600">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      placeholder="e.g., +2348012345678"
                      disabled={isSubmitting}
                      className="h-11"
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Include country code (+234 for Nigeria)
                    </p>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[200px] h-11"
                  >
                    {isLoading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <Search className="w-4 h-4 mr-2" />
                    Search Records
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results
                  {searchResults.length > 0 && (
                    <span className="ml-2 text-gray-500 font-normal">
                      ({searchResults.length} found)
                    </span>
                  )}
                </h2>
                {searchResults.length > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {searchResults.filter((r) => !r.isRegistered).length}{" "}
                    available
                  </Badge>
                )}
              </div>

              {searchResults.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Records Found
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      We {`couldn't`} find any graduate records matching your
                      search criteria. Please check your details or contact your
                      BLW Zone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="outline">Try Different Search</Button>
                      <Button variant="outline">Contact Your Zone</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {searchResults.map((record) => (
                    <Card
                      key={record.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {record.graduateFirstname}{" "}
                              {record.graduateSurname}
                            </h3>
                            <div className="flex items-center mt-2">
                              {record.isRegistered ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Already Registered
                                </Badge>
                              ) : (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  Available for Registration
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              Added{" "}
                              {new Date(record.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 mb-6">
                          {/* Zone Information */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                              Zone Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex">
                                <span className="font-medium text-gray-600 w-24">
                                  Zone:
                                </span>
                                <span className="text-gray-900">
                                  {record.zoneName}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-600 w-24">
                                  Fellowship:
                                </span>
                                <span className="text-gray-900">
                                  {record.nameOfFellowship}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-600 w-24">
                                  Chapter Pastor:
                                </span>
                                <span className="text-gray-900">
                                  {record.nameOfChapterPastor}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Education Information */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <GraduationCap className="w-4 h-4 mr-2 text-gray-600" />
                              Education Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex">
                                <span className="font-medium text-gray-600 w-24">
                                  University:
                                </span>
                                <span className="text-gray-900">
                                  {record.nameOfUniversity}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-600 w-24">
                                  Course:
                                </span>
                                <span className="text-gray-900">
                                  {record.courseOfStudy}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-600 w-24">
                                  Year:
                                </span>
                                <span className="text-gray-900">
                                  {record.graduationYear}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t pt-4">
                          {record.isRegistered ? (
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <p className="text-sm text-gray-600">
                                This record has already been claimed and
                                registered by another user.
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button
                                className="flex-1"
                                size="lg"
                                onClick={() => {
                                  window.location.href = `/graduate/register?recordId=${record.id}`;
                                }}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                This is My Record - Register
                              </Button>
                            </div>
                          )}
                        </div>

                        {!record.isRegistered && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                              <strong>Found your record?</strong> Click{" "}
                              {`"This is
                              My Record"`}{" "}
                              to proceed with your VGSS registration. Make sure
                              all the details match your information.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          {!hasSearched && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Filter className="w-5 h-5 mr-2 text-primary" />
                    Search Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      • Use your exact name as registered with your BLW Zone
                    </li>
                    <li>
                      • Include country code in your phone number (+234 for
                      Nigeria)
                    </li>
                    <li>• Ensure you select the correct zone</li>
                    <li>• Double-check spelling of your surname</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                    {` Can't`} Find Your Record?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Contact your BLW Zone to confirm upload</li>
                    <li>• Check spelling of names carefully</li>
                    <li>• Verify phone number format is correct</li>
                    <li>
                      • Ensure {`you're`} a BLW Campus Fellowship graduate
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the form in Suspense
export default function GraduateSearchPage() {
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
      <GraduateSearchForm />
    </Suspense>
  );
}
