"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StaffRequestsManagement } from "@/components/admin/staff-requests-management";

export default function VGSSOfficeStaffRequestsPage() {
  return (
    <DashboardLayout title="Staff Requests">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Requests</h1>
          <p className="text-muted-foreground">
            Review, approve, and manage staff requests from Service Departments
          </p>
        </div>

        <StaffRequestsManagement />
      </div>
    </DashboardLayout>
  );
}
