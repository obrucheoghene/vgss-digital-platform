// src/app/dashboard/blw-zone/chapters/page.tsx
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  MoreHorizontal,
  Edit,
  Loader2,
  Church,
  Trash2,
  Plus,
} from "lucide-react";
import { ChapterFormDailog } from "@/components/forms/chapter-form-dialog";
import { useChaptersForZone } from "@/hooks/user-chapters";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface Chapter {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  userId?: string;
}

export default function ChapterManagementPage() {
  const zoneChapters = useChaptersForZone();
  const queryClient = useQueryClient();

  const [openChapterDialog, setOpenChapterDialog] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter chapters based on search query
  const filteredChapters = (zoneChapters.data?.chapters || []).filter(
    (chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    setSelectedChapter(null);
    setOpenChapterDialog(true);
  };

  const handleOpenEditDialog = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setOpenChapterDialog(true);
  };

  const handleDeleteClick = (chapter: Chapter) => {
    setChapterToDelete(chapter);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!chapterToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/blw-zone/chapters/${chapterToDelete.id}`);
      toast.success("Chapter deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["chapters-for-zone"] });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.error || "Failed to delete chapter");
      } else {
        toast.error("Failed to delete chapter");
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setChapterToDelete(null);
    }
  };

  return (
    <DashboardLayout title="Chapter Management">
      <ChapterFormDailog
        open={openChapterDialog}
        setOpen={setOpenChapterDialog}
        chapter={selectedChapter}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{chapterToDelete?.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Chapter Management</h1>
            <p className="text-muted-foreground">
              Manage chapters in your zone
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleOpenAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Chapter
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Church className="w-5 h-5 mr-2" />
                  Chapter List
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Filter */}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Chapters Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox disabled />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zoneChapters.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Loading chapters...
                      </TableCell>
                    </TableRow>
                  ) : filteredChapters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <Church className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery
                            ? "No chapters found matching your search"
                            : "No chapters added yet"}
                        </p>
                        {!searchQuery && (
                          <Button
                            variant="link"
                            onClick={handleOpenAddDialog}
                            className="mt-2"
                          >
                            Add your first chapter
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredChapters.map((chapter) => (
                      <TableRow key={chapter.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Checkbox checked={false} />
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{chapter.name}</p>
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
                                Chapter Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenEditDialog(chapter)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Chapter
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(chapter)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Chapter
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Results count */}
            {!zoneChapters.isLoading && filteredChapters.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredChapters.length} of{" "}
                {zoneChapters.data?.chapters?.length || 0} chapters
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
