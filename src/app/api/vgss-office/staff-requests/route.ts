// src/app/api/vgss-office/staff-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { staffRequests, users } from "@/lib/db/schema";
import { eq, desc, and, or, ilike, count } from "drizzle-orm";

// GET - List all staff requests (VGSS Office only)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is VGSS_OFFICE
    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");
    const department = searchParams.get("department");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (status && status !== "all") {
      conditions.push(
        eq(
          staffRequests.status,
          status as
            | "Pending"
            | "Approved"
            | "Rejected"
            | "Fulfilled"
            | "Cancelled"
        )
      );
    }

    if (urgency && urgency !== "all") {
      conditions.push(
        eq(
          staffRequests.urgency,
          urgency as "Low" | "Medium" | "High" | "Urgent"
        )
      );
    }

    if (department && department !== "all") {
      conditions.push(eq(staffRequests.serviceDepartmentId, department));
    }

    if (search) {
      conditions.push(
        or(
          ilike(staffRequests.positionTitle, `%${search}%`),
          ilike(staffRequests.positionDescription, `%${search}%`)
        )
      );
    }

    // Get requests with department info
    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const requests = await db
      .select({
        id: staffRequests.id,
        serviceDepartmentId: staffRequests.serviceDepartmentId,
        positionTitle: staffRequests.positionTitle,
        positionDescription: staffRequests.positionDescription,
        numberOfStaff: staffRequests.numberOfStaff,
        skillsRequired: staffRequests.skillsRequired,
        qualificationsRequired: staffRequests.qualificationsRequired,
        preferredGender: staffRequests.preferredGender,
        urgency: staffRequests.urgency,
        status: staffRequests.status,
        approvedBy: staffRequests.approvedBy,
        approvedAt: staffRequests.approvedAt,
        rejectionReason: staffRequests.rejectionReason,
        fulfilledCount: staffRequests.fulfilledCount,
        fulfilledAt: staffRequests.fulfilledAt,
        notes: staffRequests.notes,
        createdAt: staffRequests.createdAt,
        updatedAt: staffRequests.updatedAt,
        departmentName: users.name,
        departmentEmail: users.email,
      })
      .from(staffRequests)
      .leftJoin(users, eq(staffRequests.serviceDepartmentId, users.id))
      .where(whereClause)
      .orderBy(desc(staffRequests.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(staffRequests)
      .where(whereClause);

    const total = totalResult?.count || 0;

    // Get overall stats
    const statsResult = await db
      .select({
        status: staffRequests.status,
        count: count(),
      })
      .from(staffRequests)
      .groupBy(staffRequests.status);

    const stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      fulfilled: 0,
      cancelled: 0,
    };

    statsResult.forEach((row) => {
      stats.total += row.count;
      const statusKey = row.status.toLowerCase() as keyof typeof stats;
      if (statusKey in stats) {
        stats[statusKey] = row.count;
      }
    });

    // Get list of departments for filtering
    const departmentsResult = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(eq(users.type, "SERVICE_DEPARTMENT"));

    return NextResponse.json({
      success: true,
      requests,
      stats,
      departments: departmentsResult,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get staff requests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
