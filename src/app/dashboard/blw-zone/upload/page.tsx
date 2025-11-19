// src/app/dashboard/blw-zone/upload/page.tsx
"use client";

import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  X,
  Users,
  Loader2,
  Eye,
  Trash2,
} from "lucide-react";
import UploadGraduateForm from "@/components/forms/upload-graduate";

interface GraduateUploadData {
  graduateFirstname: string;
  graduateSurname: string;
  graduateGender: "MALE" | "FEMALE";
  graduatePhoneNumber: string;
  nameOfUniversity: string;
  courseOfStudy: string;
  graduationYear: string;
  nameOfFellowship: string;
  nameOfZonalPastor: string;
  nameOfChapterPastor: string;
  phoneNumberOfChapterPastor: string;
  emailOfChapterPastor: string;
  kingschatIDOfChapterPastor: string;
  errors?: string[];
  isValid?: boolean;
}

interface UploadHistory {
  id: string;
  filename: string;
  uploadDate: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: "processing" | "completed" | "failed";
}

export default function ZoneUploadPage() {
  const [uploadData, setUploadData] = useState<GraduateUploadData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock upload history - replace with real data
  const uploadHistory: UploadHistory[] = [
    {
      id: "1",
      filename: "graduates_january_2024.xlsx",
      uploadDate: "2024-01-15",
      totalRecords: 45,
      successfulRecords: 43,
      failedRecords: 2,
      status: "completed",
    },
    {
      id: "2",
      filename: "new_graduates_february.csv",
      uploadDate: "2024-02-01",
      totalRecords: 23,
      successfulRecords: 23,
      failedRecords: 0,
      status: "completed",
    },
    {
      id: "3",
      filename: "march_batch_graduates.xlsx",
      uploadDate: "2024-03-10",
      totalRecords: 31,
      successfulRecords: 28,
      failedRecords: 3,
      status: "processing",
    },
  ];

  const requiredColumns = [
    "graduateFirstname",
    "graduateSurname",
    "graduateGender",
    "graduatePhoneNumber",
    "nameOfUniversity",
    "courseOfStudy",
    "graduationYear",
    "nameOfFellowship",
    "nameOfZonalPastor",
    "nameOfChapterPastor",
    "phoneNumberOfChapterPastor",
    "emailOfChapterPastor",
    "kingschatIDOfChapterPastor",
  ];

  const sampleData = [
    {
      graduateFirstname: "John",
      graduateSurname: "Doe",
      graduateGender: "MALE",
      graduatePhoneNumber: "+234 803 567 8594",
      nameOfUniversity: "Ambrose Ali University",
      courseOfStudy: "Computer Science",
      graduationYear: "2023",
      nameOfFellowship: "Victory Fellowship",
      nameOfZonalPastor: "Pastor James Wilson",
      nameOfChapterPastor: "Pastor Mary Johnson",
      phoneNumberOfChapterPastor: "+234 801 234 5678",
      emailOfChapterPastor: "mary.johnson@loveworld.org",
      kingschatIDOfChapterPastor: "maryjohnson_lw",
    },
    {
      graduateFirstname: "Jane",
      graduateSurname: "Smith",
      graduateGender: "FEMALE",
      graduatePhoneNumber: "+234 801 456 8038",
      nameOfUniversity: "University of Benin",
      courseOfStudy: "Electrical and Electronics Engineering",
      graduationYear: "2024",
      nameOfFellowship: "Campus Fellowship",
      nameOfZonalPastor: "Pastor David Brown",
      nameOfChapterPastor: "Pastor Sarah Davis",
      phoneNumberOfChapterPastor: "+234 802 345 6789",
      emailOfChapterPastor: "sarah.davis@loveworld.org",
      kingschatIDOfChapterPastor: "sarahdavis_lw",
    },
  ];

  const validateData = (data: GraduateUploadData[]): GraduateUploadData[] => {
    const errors: string[] = [];

    return data.map((row, index) => {
      const rowErrors: string[] = [];

      // Check required fields
      requiredColumns.forEach((column) => {
        if (
          !row[column as keyof GraduateUploadData] ||
          (row[column as keyof GraduateUploadData] as string).trim() === ""
        ) {
          rowErrors.push(`${column} is required`);
        }
      });

      // Validate gender
      if (
        row.graduateGender &&
        !["MALE", "FEMALE"].includes(row.graduateGender)
      ) {
        rowErrors.push("Gender must be MALE or FEMALE");
      }

      // Validate email format
      if (row.emailOfChapterPastor) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.emailOfChapterPastor)) {
          rowErrors.push("Invalid email format");
        }
      }

      // Validate phone number format
      if (row.graduatePhoneNumber) {
        const phoneRegex = /^\+[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(row.graduatePhoneNumber)) {
          rowErrors.push("Invalid phone number format");
        }
      }

      if (row.phoneNumberOfChapterPastor) {
        const pastorPhoneRegex = /^\+[\d\s\-\(\)]+$/;
        if (!pastorPhoneRegex.test(row.phoneNumberOfChapterPastor)) {
          rowErrors.push("Invalid phone number format");
        }
      }

      if (rowErrors.length > 0) {
        errors.push(`Row ${index + 1}: ${rowErrors.join(", ")}`);
      }

      return {
        ...row,
        errors: rowErrors,
        isValid: rowErrors.length === 0,
      };
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError("");
    setSuccess("");
    setUploadData([]);
    setValidationErrors([]);

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid CSV or Excel file (.csv, .xls, .xlsx)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setIsProcessing(true);

    try {
      // Process the file
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/blw-zone/parse-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process file");
      }

      const validatedData = validateData(result.data);
      setUploadData(validatedData);

      const errors = validatedData
        .map(
          (row, index) =>
            row.errors?.map((error) => `Row ${index + 1}: ${error}`) || []
        )
        .flat();

      setValidationErrors(errors);
      setPreviewMode(true);

      if (errors.length === 0) {
        setSuccess(
          `File processed successfully! ${validatedData.length} records ready for upload.`
        );
      } else {
        setError(
          `File processed with ${errors.length} validation errors. Please review and fix before uploading.`
        );
      }
    } catch (error) {
      console.error("File processing error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process file"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (uploadData.length === 0) {
      setError("No data to upload");
      return;
    }

    const validRecords = uploadData.filter((row) => row.isValid);
    if (validRecords.length === 0) {
      setError(
        "No valid records to upload. Please fix validation errors first."
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");
    setSuccess("");

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/blw-zone/upload-graduates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          graduates: validRecords,
          filename: selectedFile?.name,
        }),
      });

      const result = await response.json();

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setSuccess(
        `Upload completed successfully! ${
          result.successCount
        } records uploaded, ${result.duplicateCount || 0} duplicates skipped.`
      );

      // Reset form
      setTimeout(() => {
        setUploadData([]);
        setSelectedFile(null);
        setPreviewMode(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = requiredColumns;

    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) =>
        headers
          .map((header) => `"${row[header as keyof typeof row] || ""}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vgss_graduate_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearData = () => {
    setUploadData([]);
    setSelectedFile(null);
    setPreviewMode(false);
    setError("");
    setSuccess("");
    setValidationErrors([]);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout title="Graduate Upload System">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Upload Graduate Records</h1>
            <p className="text-muted-foreground">
              Upload graduate information from your zone
            </p>
            {/* <p className="text-muted-foreground">
              Upload graduate information from your zone via CSV or Excel files
            </p> */}
          </div>
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className=" hidden"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        <Tabs defaultValue="addrecord" className="space-y-6">
          {/* <TabsList>
            <TabsTrigger value="addrecord">Add Record</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="history">Upload History</TabsTrigger>
          </TabsList> */}

          <TabsContent value="addrecord" className="space-y-6">
            <UploadGraduateForm />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload File
                </CardTitle>
                <CardDescription>
                  Select a CSV or Excel file containing graduate information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="file">Select File *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      disabled={isProcessing || isUploading}
                      ref={fileInputRef}
                    />
                    <p className="text-xs text-muted-foreground">
                      Supported formats: CSV, Excel (.xlsx, .xls) - Max size:
                      5MB
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>File Information</Label>
                    {selectedFile ? (
                      <div className="p-3 border rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            {selectedFile.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 border border-dashed rounded-lg text-center text-muted-foreground">
                        <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No file selected</p>
                      </div>
                    )}
                  </div>
                </div>

                {isProcessing && (
                  <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-blue-800">Processing file...</span>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading records...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Data Preview */}
            {previewMode && uploadData.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Data Preview
                      </CardTitle>
                      <CardDescription>
                        Review the data before uploading - {uploadData.length}{" "}
                        records found
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={clearData}
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={
                          isUploading ||
                          uploadData.filter((row) => row.isValid).length === 0
                        }
                      >
                        {isUploading && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        <Upload className="w-4 h-4 mr-2" />
                        Upload {
                          uploadData.filter((row) => row.isValid).length
                        }{" "}
                        Records
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {validationErrors.length > 0 && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium mb-2">
                          {validationErrors.length} validation error(s) found:
                        </div>
                        <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                          {validationErrors.slice(0, 10).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                          {validationErrors.length > 10 && (
                            <li>
                              • ... and {validationErrors.length - 10} more
                              errors
                            </li>
                          )}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="rounded-lg border overflow-hidden">
                    <div className="max-h-96 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>University</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Graduation Year</TableHead>
                            <TableHead>Fellowship</TableHead>
                            <TableHead>Zonal Pastor</TableHead>
                            <TableHead>Chapter Pastor</TableHead>
                            <TableHead>Pastor Phone Number</TableHead>
                            <TableHead>Pastor Email</TableHead>
                            <TableHead>Pastor KingsChatId</TableHead>
                            <TableHead>Errors</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploadData.slice(0, 50).map((row, index) => (
                            <TableRow
                              key={index}
                              className={!row.isValid ? "bg-red-50" : ""}
                            >
                              <TableCell className="font-medium">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                {row.isValid ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Valid
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Invalid
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {row.graduateFirstname} {row.graduateSurname}
                              </TableCell>
                              <TableCell>{row.graduateGender}</TableCell>
                              <TableCell>{row.graduatePhoneNumber}</TableCell>
                              <TableCell>{row.nameOfUniversity}</TableCell>
                              <TableCell>{row.courseOfStudy}</TableCell>
                              <TableCell>{row.graduationYear}</TableCell>
                              <TableCell>{row.nameOfFellowship}</TableCell>
                              <TableCell>{row.nameOfZonalPastor}</TableCell>
                              <TableCell>{row.nameOfChapterPastor}</TableCell>
                              <TableCell>
                                {row.phoneNumberOfChapterPastor}
                              </TableCell>
                              <TableCell>{row.emailOfChapterPastor}</TableCell>
                              <TableCell>
                                {row.kingschatIDOfChapterPastor}
                              </TableCell>
                              <TableCell>
                                {row.errors && row.errors.length > 0 && (
                                  <div className="text-xs text-red-600">
                                    {row.errors.slice(0, 2).join(", ")}
                                    {row.errors.length > 2 && "..."}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {uploadData.length > 50 && (
                      <div className="p-3 bg-muted/50 text-center text-sm text-muted-foreground">
                        Showing first 50 of {uploadData.length} records
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {uploadData.length}
                      </div>
                      <div className="text-sm text-blue-800">Total Records</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {uploadData.filter((row) => row.isValid).length}
                      </div>
                      <div className="text-sm text-green-800">
                        Valid Records
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {uploadData.filter((row) => !row.isValid).length}
                      </div>
                      <div className="text-sm text-red-800">
                        Invalid Records
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Required Columns</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {requiredColumns.map((column) => (
                        <li key={column}>• {column}</li>
                      ))}
                    </ul>
                  </div>
                  {/* <div>
                    <h4 className="font-medium mb-2">Optional Columns</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• kingschatIDOfChapterPastor</li>
                    </ul>
                  </div> */}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Important Notes
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • Gender must be either {`"MALE" or "FEMALE"`} (case
                      sensitive)
                    </li>
                    <li>• Email addresses must be valid format</li>
                    <li>
                      • Phone numbers should include country code (+234 for
                      Nigeria)
                    </li>
                    <li>• Duplicate records will be automatically skipped</li>
                    <li>• Maximum file size is 5MB</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Upload History
                </CardTitle>
                <CardDescription>
                  Previous graduate data uploads from your zone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Filename</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Total Records</TableHead>
                        <TableHead>Successful</TableHead>
                        <TableHead>Failed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadHistory.map((upload) => (
                        <TableRow key={upload.id}>
                          <TableCell className="font-medium">
                            {upload.filename}
                          </TableCell>
                          <TableCell>
                            {new Date(upload.uploadDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{upload.totalRecords}</TableCell>
                          <TableCell>
                            <span className="text-green-600 font-medium">
                              {upload.successfulRecords}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-red-600 font-medium">
                              {upload.failedRecords}
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(upload.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {uploadHistory.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No Upload History
                    </h3>
                    <p className="text-muted-foreground">
                      Upload your first batch of graduates to see history here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
