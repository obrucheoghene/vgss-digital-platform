// src/app/dashboard/vgss-office/graduates/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

import {
  GraduationCap,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Loader2,
  Building,
  User,
  FileText,
  Church,
} from "lucide-react";
import { toast } from "sonner";
import { ChapterFormDailog } from "@/components/forms/chapter-form-dialog";

interface Chapter {
  id: string;
  name: string;
  createdAt: string;
}

export default function GraduateManagementPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openChapterDialog, setOpenChapterDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/blw-zone/chapters");
        const data = await response.json();
        setChapters(data.chapters || []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChapters();
  }, []);

  return (
    <DashboardLayout title="Graduate Management">
      <ChapterFormDailog
        open={openChapterDialog}
        setOpen={setOpenChapterDialog}
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Chapter Management</h1>
            <p className="text-muted-foreground">Manage chapters the zone</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setOpenChapterDialog(true)}>
              Add Chapter
            </Button>
          </div>
        </div>

        {/* Status Tabs */}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Church className="w-5 h-5 mr-2" />
                  Chapter List
                </CardTitle>
                {/* <CardDescription>
                      Manage graduate registrations, approvals, and service
                      assignments
                    </CardDescription> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                  Search Chapter
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name..."
                    // value={}
                    // onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Graduates Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        // checked={isAllSelected}
                        // onCheckedChange={handleSelectAll}
                        ref={(ref) => {
                          // if (ref) ref.indeterminate = isSomeSelected;
                        }}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>

                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Loading graduates...
                      </TableCell>
                    </TableRow>
                  ) : (
                    chapters.map((chapter) => (
                      <TableRow key={chapter.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Checkbox checked={false} />
                        </TableCell>
                        <TableCell>
                          <p>{chapter.name}</p>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Graduate Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                              // onClick={() => {
                              //   setSelectedGraduate(graduate);
                              //   setIsDetailModalOpen(true);
                              // }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Information
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />

                              <DropdownMenuSeparator />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
