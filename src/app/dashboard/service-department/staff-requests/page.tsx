"use client";

import { StaffRequestsTable } from "@/components/service-department/staff-requests-table";

export default function ServiceDepartmentStaffRequestsPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Staff Requests</h1>
        <p className="text-muted-foreground">
          Request and manage VGSS staff assignments for your department
        </p>
      </div>

      <StaffRequestsTable />
    </div>
  );
}
