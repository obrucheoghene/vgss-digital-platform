"use client";

import { StaffRequestsManagement } from "@/components/admin/staff-requests-management";

export default function VGSSOfficeStaffRequestsPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Staff Requests</h1>
        <p className="text-muted-foreground">
          Review, approve, and manage staff requests from Service Departments
        </p>
      </div>

      <StaffRequestsManagement />
    </div>
  );
}
