// src/app/api/dashboard/vgss-office/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, graduateData, zoneGraduates } from "@/lib/db/schema";
import { eq, count, and, desc, gte, lt } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current date ranges for trends
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all statistics in parallel
    const [
      // Total counts
      totalGraduatesResult,
      totalBLWZonesResult,
      totalServiceDepartmentsResult,
      pendingReviewsResult,

      // This month counts
      thisMonthGraduatesResult,
      // lastMonthGraduatesResult,

      // User statistics by type
      userStats,

      // Graduate status distribution
      graduateStatusStats,
    ] = await Promise.all([
      // Total graduates registered
      db.select({ count: count() }).from(graduateData),

      // Total BLW Zones
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.type, "BLW_ZONE")),

      // Total Ministry Offices
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.type, "SERVICE_DEPARTMENT")),

      // Pending reviews (graduates under review)
      db
        .select({ count: count() })
        .from(graduateData)
        .where(eq(graduateData.status, "Under Review")),

      // This month registrations
      db
        .select({ count: count() })
        .from(graduateData)
        .where(gte(graduateData.createdAt, startOfMonth)),

      // Last month registrations
      // db
      //   .select({ count: count() })
      //   .from(graduateData)
      //   .where(
      //     and(
      //       gte(graduateData.createdAt, startOfLastMonth),
      //       lt(graduateData.createdAt, startOfMonth)
      //     )
      //   ),

      // User statistics by type and status
      db
        .select({
          type: users.type,
          accountStatus: users.accountStatus,
          isDeactivated: users.isDeactivated,
        })
        .from(users),

      // Graduate status distribution
      db
        .select({
          status: graduateData.status,
          count: count(),
        })
        .from(graduateData)
        .groupBy(graduateData.status),
    ]);

    // Calculate trends
    const thisMonthCount = thisMonthGraduatesResult[0]?.count || 0;
    // const lastMonthCount = lastMonthGraduatesResult[0]?.count || 0;
    // const graduatesTrend =
    //   lastMonthCount > 0
    //     ? (((thisMonthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(
    //         1
    //       )
    //     : thisMonthCount > 0
    //     ? "100.0"
    //     : "0";

    // Process user statistics
    const activeUsers = userStats.filter(
      (u) => u.accountStatus === "active" && !u.isDeactivated
    ).length;

    const usersByType = userStats.reduce((acc, user) => {
      acc[user.type] = (acc[user.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Process graduate status distribution
    const statusDistribution = graduateStatusStats.reduce((acc, stat) => {
      acc[stat.status] = stat.count;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      totalGraduates: totalGraduatesResult[0]?.count || 0,
      thisMonthRegisteredGraduates: thisMonthCount,
      totalBLWZones: totalBLWZonesResult[0]?.count || 0,
      totalServiceDepartments: totalServiceDepartmentsResult[0]?.count || 0,
      pendingReviews: pendingReviewsResult[0]?.count || 0,
      // Trends
      // User statistics
      totalUsers: userStats.length,
      activeUsers,
      usersByType: {
        VGSS_OFFICE: usersByType.VGSS_OFFICE || 0,
        BLW_ZONE: usersByType.BLW_ZONE || 0,
        SERVICE_DEPARTMENT: usersByType.SERVICE_DEPARTMENT || 0,
        GRADUATE: usersByType.GRADUATE || 0,
      },

      // Graduate status distribution
      statusDistribution,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
