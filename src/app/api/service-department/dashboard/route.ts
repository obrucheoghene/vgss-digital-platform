// src/app/api/service-department/dashboard/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData, staffRequests, users, chapters } from "@/lib/db/schema";
import { eq, and, count, sql } from "drizzle-orm";

// GET - Get dashboard data for the logged-in service department
export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated and is a SERVICE_DEPARTMENT
    if (
      !session ||
      !session.user ||
      session.user.type !== "SERVICE_DEPARTMENT"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceDepartmentId = session.user.id;

    // Get assigned staff count and list
    const assignedStaff = await db
      .select({
        id: graduateData.id,
        graduateFirstname: graduateData.graduateFirstname,
        graduateSurname: graduateData.graduateSurname,
        email: graduateData.email,
        graduateGender: graduateData.graduateGender,
        graduatePhoneNumber: graduateData.graduatePhoneNumber,
        status: graduateData.status,
        serviceStartedDate: graduateData.serviceStartedDate,
        serviceCompletedDate: graduateData.serviceCompletedDate,
        courseOfStudy: graduateData.courseOfStudy,
        nameOfUniversity: graduateData.nameOfUniversity,
        chapterName: chapters.name,
      })
      .from(graduateData)
      .leftJoin(chapters, eq(graduateData.chapterId, chapters.id))
      .where(eq(graduateData.serviceDepartmentId, serviceDepartmentId));

    // Calculate service progress for each staff member
    const staffWithProgress = assignedStaff.map((staff) => {
      let serviceProgress = 0;
      let serviceDaysCompleted = 0;
      const totalServiceDays = 365;

      if (staff.serviceStartedDate) {
        const startDate = new Date(staff.serviceStartedDate);
        const today = new Date();
        const endDate = staff.serviceCompletedDate
          ? new Date(staff.serviceCompletedDate)
          : today;

        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        serviceDaysCompleted = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        serviceProgress = Math.min(
          Math.round((serviceDaysCompleted / totalServiceDays) * 100),
          100
        );
      }

      return {
        ...staff,
        serviceProgress,
        serviceDaysCompleted,
        totalServiceDays,
      };
    });

    // Get staff request statistics
    const [requestStats] = await db
      .select({
        total: count(),
        pending: sql<number>`COUNT(CASE WHEN ${staffRequests.status} = 'Pending' THEN 1 END)`,
        approved: sql<number>`COUNT(CASE WHEN ${staffRequests.status} = 'Approved' THEN 1 END)`,
        fulfilled: sql<number>`COUNT(CASE WHEN ${staffRequests.status} = 'Fulfilled' THEN 1 END)`,
        rejected: sql<number>`COUNT(CASE WHEN ${staffRequests.status} = 'Rejected' THEN 1 END)`,
      })
      .from(staffRequests)
      .where(eq(staffRequests.serviceDepartmentId, serviceDepartmentId));

    // Get recent staff requests
    const recentRequests = await db
      .select({
        id: staffRequests.id,
        positionTitle: staffRequests.positionTitle,
        numberOfStaff: staffRequests.numberOfStaff,
        urgency: staffRequests.urgency,
        status: staffRequests.status,
        fulfilledCount: staffRequests.fulfilledCount,
        createdAt: staffRequests.createdAt,
      })
      .from(staffRequests)
      .where(eq(staffRequests.serviceDepartmentId, serviceDepartmentId))
      .orderBy(sql`${staffRequests.createdAt} DESC`)
      .limit(5);

    // Get service department info
    const [departmentInfo] = await db
      .select({
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, serviceDepartmentId));

    // Calculate summary stats
    const activeStaffCount = assignedStaff.filter(
      (s) => s.status === "Serving"
    ).length;
    const totalStaffCount = assignedStaff.length;

    return NextResponse.json({
      success: true,
      department: departmentInfo,
      stats: {
        totalStaff: totalStaffCount,
        activeStaff: activeStaffCount,
        pendingRequests: requestStats?.pending || 0,
        approvedRequests: requestStats?.approved || 0,
        fulfilledRequests: requestStats?.fulfilled || 0,
        totalRequests: requestStats?.total || 0,
      },
      staff: staffWithProgress,
      recentRequests,
    });
  } catch (error) {
    console.error("Get service department dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
