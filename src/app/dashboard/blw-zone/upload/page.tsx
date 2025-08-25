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

interface GraduateUploadData {
  graduateFirstname: string;
  graduateLastname: string;
  graduateGender: "MALE" | "FEMALE";
  nameOfFellowship: string;
  nameOfZonalPastor: string;
  nameOfChapterPastor: string;
  phoneNumberOfChapterPastor: string;
  emailOfChapterPastor: string;
  kingschatIDOfChapterPastor?: string;
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
    "graduateLastname",
    "graduateGender",
    "nameOfFellowship",
    "nameOfZonalPastor",
    "nameOfChapterPastor",
    "phoneNumberOfChapterPastor",
    "emailOfChapterPastor",
  ];

  const sampleData = [
    {
      graduateFirstname: "John",
      graduateLastname: "Doe",
      graduateGender: "MALE",
      nameOfFellowship: "Victory Fellowship",
      nameOfZonalPastor: "Pastor James Wilson",
      nameOfChapterPastor: "Pastor Mary Johnson",
      phoneNumberOfChapterPastor: "+234 801 234 5678",
      emailOfChapterPastor: "mary.johnson@loveworld.org",
      kingschatIDOfChapterPastor: "maryjohnson_lw",
    },
    {
      graduateFirstname: "Jane",
      graduateLastname: "Smith",
      graduateGender: "FEMALE",
      nameOfFellowship: "Faith Chapel",
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
        if (!row[column as keyof GraduateUploadData] || 
            (row[column as keyof GraduateUploadData] as string).trim() === "") {
          rowErrors.push(`${column} is required`);
        }
      });

      // Validate gender
      if (row.graduateGender && !["MALE", "FEMALE"].includes(row.graduateGender)) {
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
      if (row.phoneNumberOfChapterPastor) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(row.phoneNumberOfChapterPastor)) {
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      const response = await fetch("/api/zone/parse-upload", {
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
        .map((row, index) => 
          row.errors?.map(error => `Row ${index + 1}: ${error}`) || []
        )
        .flat();

      setValidationErrors(errors);
      setPreviewMode(true);

      if (errors.length === 0) {
        setSuccess(`File processed successfully! ${validatedData.length} records ready for upload.`);
      } else {
        setError(`File processed with ${errors.length} validation errors. Please review and fix before uploading.`);
      }
    } catch (error) {
      console.error("File processing error:", error);
      setError(error instanceof Error ? error.message : "Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (uploadData.length === 0) {
      setError("No data to upload");
      return;
    }

    const validRecords = uploadData.filter(row => row.isValid);
    if (validRecords.length === 0) {
      setError("No valid records to upload. Please fix validation errors first.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");
    setSuccess("");

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/zone/upload-graduates", {
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
        `Upload completed successfully! ${result.successCount} records uploaded, ${result.duplicateCount || 0} duplicates skipped.`
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
    const headers = [
      "graduateFirstname",
      "graduateLastname",
      "graduateGender",
      "nameOfFellowship",
      "nameOfZonalPastor",
      "nameOfChapterPastor",
      "phoneNumberOfChapterPastor",
      "emailOfChapterPastor",
      "kingschatIDOfChapterPastor",
    ];

    const csvContent = [
      headers.join(","),
      ...sampleData.map(row =>
        headers.map(header => `"${row[header as keyof typeof row] || ""}"`).join(",")
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
              Upload graduate information from your zone via CSV or Excel files
            </p>
          </div>
          <Button onClick={downloadTemplate} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="history">Upload History</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload File
                </CardTitle>
                <Car
