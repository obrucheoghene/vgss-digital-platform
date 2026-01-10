"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StaffRequestsTable } from "@/components/service-department/staff-requests-table";

export default function ServiceDepartmentStaffRequestsPage() {
  return (
    <DashboardLayout title="Staff Requests">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Requests</h1>
          <p className="text-muted-foreground">
            Request and manage VGSS staff assignments for your department
          </p>
        </div>

        <StaffRequestsTable />
      </div>
    </DashboardLayout>
  );
}
