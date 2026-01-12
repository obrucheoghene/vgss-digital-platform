// src/app/api/vgss-office/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, graduateData, zoneGraduates, staffRequests } from "@/lib/db/schema";
import { eq, count, and, sql, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all counts in parallel
    const [
      totalUsersResult,
      activeUsersResult,
      totalGraduatesResult,
      totalZonesResult,
      totalServiceDeptResult,
      totalZoneGraduatesResult,
      pendingRequestsResult,
      adminUsersResult,
    ] = await Promise.all([
      // Total users
      db.select({ count: count() }).from(users),
      // Active users (not deactivated)
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.isDeactivated, false)),
      // Total registered graduates
      db.select({ count: count() }).from(graduateData),
      // Total BLW Zones
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.type, "BLW_ZONE")),
      // Total Service Departments
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.type, "SERVICE_DEPARTMENT")),
      // Total zone graduates (uploaded by zones)
      db.select({ count: count() }).from(zoneGraduates),
      // Pending staff requests
      db
        .select({ count: count() })
        .from(staffRequests)
        .where(eq(staffRequests.status, "Pending")),
      // Admin users (VGSS_OFFICE)
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          isDeactivated: users.isDeactivated,
          accountStatus: users.accountStatus,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.type, "VGSS_OFFICE"))
        .orderBy(desc(users.createdAt)),
    ]);

    // Get graduate status breakdown
    const graduateStatusBreakdown = await db
      .select({
        status: graduateData.status,
        count: count(),
      })
      .from(graduateData)
      .groupBy(graduateData.status);

    // Get staff request status breakdown
    const staffRequestStatusBreakdown = await db
      .select({
        status: staffRequests.status,
        count: count(),
      })
      .from(staffRequests)
      .groupBy(staffRequests.status);

    const metrics = {
      totalUsers: totalUsersResult[0]?.count || 0,
      activeUsers: activeUsersResult[0]?.count || 0,
      totalGraduates: totalGraduatesResult[0]?.count || 0,
      totalZoneGraduates: totalZoneGraduatesResult[0]?.count || 0,
      totalZones: totalZonesResult[0]?.count || 0,
      totalServiceDepartments: totalServiceDeptResult[0]?.count || 0,
      pendingStaffRequests: pendingRequestsResult[0]?.count || 0,
      graduatesByStatus: graduateStatusBreakdown.reduce(
        (acc, item) => {
          acc[item.status] = item.count;
          return acc;
        },
        {} as Record<string, number>
      ),
      staffRequestsByStatus: staffRequestStatusBreakdown.reduce(
        (acc, item) => {
          acc[item.status] = item.count;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    // Format admin users
    const adminUsers = adminUsersResult.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "Administrator",
      isActive: !user.isDeactivated && user.accountStatus === "active",
      accountStatus: user.accountStatus,
      lastLogin: user.lastLoginAt?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      metrics,
      adminUsers,
    });
  } catch (error) {
    console.error("Settings API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
