// src/app/graduate/search/page.tsx
"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import z from "zod";
import { Form, SubmitHandler, useForm } from "react-hook-form";
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
  zoneName?: string; // Added for display
}

interface ZoneData {
  id: string;
  name: string;
}

const SearchValues = z.object({
  surname: z.string().trim().min(1, "Surname is required"),
  zone: z.string().min(1, "Zone is required"),
  gender: z.enum(["MALE", "FEMALE"], "Gender is required "),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+\d+$/,
      "Phone number must begin with your country code and contain only digits"
    ),
});

export default function GraduateSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GraduateRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [zones, setZones] = useState<ZoneData[]>([]);
  type SearchType = z.infer<typeof SearchValues>;

  const {
    control,
    handleSubmit,
    register,
    setFocus,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SearchType>({
    resolver: zodResolver(SearchValues),
    defaultValues: {
      surname: initialQuery,
      zone: "",
      // gender: "",
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
    try {
      // Call the actual API
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
        console.log(data);
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Graduate Search
                </h1>
                <p className="text-xs text-muted-foreground">
                  Find your VGSS record
                </p>
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
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Search Graduate Records
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your graduate information that was uploaded by your BLW Zone.
              Once found, you can proceed with your VGSS registration.
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search Criteria
              </CardTitle>
              <CardDescription>
                Enter your details to find your graduate record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(performSearch)}
                className="space-y-6"
              >
                <div className="flex flex-col gap-4 ">
                  <div className=" space-y-2">
                    <Select
                      value={watch("zone")}
                      onValueChange={(value) => setValue("zone", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select your zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((value) => (
                          <SelectItem key={value.id} value={value.id}>
                            {value.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="mt-[-6px] text-sm text-red-500">
                      {errors.zone?.message}
                    </span>
                  </div>
                  <div className=" space-y-2">
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      id="search"
                      {...register("surname")}
                      placeholder="Enter your surname"
                      disabled={isSubmitting}
                      className="h-11"
                    />
                    <span className="mt-[-6px] text-sm text-red-500">
                      {errors.surname?.message}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={watch("gender")}
                      onValueChange={(value: "MALE" | "FEMALE") =>
                        setValue("gender", value)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="mt-[-6px] text-sm text-red-500">
                      {errors.gender?.message}
                    </span>
                  </div>

                  <div className=" space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      placeholder="Enter your phone number"
                      disabled={isSubmitting}
                      className="h-11"
                    />
                    <span className="mt-[-6px] text-sm text-red-500">
                      {errors.phoneNumber?.message}
                    </span>
                    <p className=" text-sm">
                      Phone numbers should include country code (+234 for
                      Nigeria)
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-end space-x-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      <Search className="w-4 h-4 mr-2" />
                      Search Records
                    </Button>
                  </div>
                </div>
              </form>

              {/* {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )} */}
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Search Results
                  {searchResults.length > 0 && (
                    <span className="ml-2 text-muted-foreground">
                      ({searchResults.length} found)
                    </span>
                  )}
                </h2>
                {searchResults.length > 0 && (
                  <Badge variant="outline">
                    {searchResults.filter((r) => !r.isRegistered).length}{" "}
                    available for registration
                  </Badge>
                )}
              </div>

              {searchResults.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No Records Found
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      We {`couldn't`} find any graduate records matching your
                      search criteria. Please check your details or contact your
                      BLW Zone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="outline"
                        // onClick={() => setSearchQuery("")}
                      >
                        Try Different Search
                      </Button>
                      <Button variant="outline">Contact Your Zone</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {searchResults.map((record) => (
                    <Card
                      key={record.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {record.graduateFirstname}{" "}
                              {record.graduateSurname}
                            </h3>
                            <div className="text-right">
                              {record.isRegistered ? (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 border-green-200"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Already Registered
                                </Badge>
                              ) : (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  Available
                                </Badge>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                Added{" "}
                                {new Date(
                                  record.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 mb-6">
                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Zone Information
                            </h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <span className=" font-medium">Zone:</span>

                                <span>{record.zoneName}</span>
                              </div>
                              <div>
                                <span className="font-medium">
                                  Zonal Pastor:
                                </span>{" "}
                                {record.nameOfZonalPastor}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Chapter Pastor:
                                </span>{" "}
                                {record.nameOfChapterPastor}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              School Information
                            </h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">School:</span>{" "}
                                {record.nameOfUniversity}
                              </div>
                              <div>
                                <span className="font-medium">Course:</span>{" "}
                                {record.courseOfStudy}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Graduation Year:
                                </span>{" "}
                                {record.graduationYear}
                              </div>
                              {/* {record.registeredAt && (
                                <div>
                                  <span className="font-medium">
                                    Registered:
                                  </span>{" "}
                                  {new Date(
                                    record.registeredAt
                                  ).toLocaleDateString()}
                                </div>
                              )} */}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          {record.isRegistered ? (
                            <div className="flex-1 p-3 bg-muted/50 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">
                                This record has already been claimed and
                                registered by another user.
                              </p>
                            </div>
                          ) : (
                            <>
                              <Button
                                className="flex-1"
                                size="lg"
                                onClick={() => {
                                  // Navigate to registration with this record ID
                                  window.location.href = `/graduate/register?recordId=${record.id}`;
                                }}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                This is My Record - Register
                              </Button>
                              {/* <Button variant="outline" size="lg">
                                Verify Details
                              </Button> */}
                            </>
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
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                  Search Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">
                      How to Search Effectively
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>
                        • Use your exact name as registered with your BLW Zone
                      </li>
                      <li>• Add country code to you phone number</li>
                      <li>• Ensure you selected your zone accurately</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">
                      {`Can't`} Find Your Record?
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Contact your BLW Zone to confirm upload</li>
                      <li>• Check spelling of names carefully</li>
                      <li>• Check you enter your phone number correctly</li>
                      <li>
                        • Ensure {`you're`} a BLW Campus Fellowship graduate
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Support */}
          <Card className="mt-8 hidden">
            <CardContent className="text-center py-6">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                If {`you're`} having trouble finding your record or need
                assistance, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">Contact Support</Button>
                <Button variant="outline">Contact Your BLW Zone</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
