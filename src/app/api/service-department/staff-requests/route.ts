// src/app/api/service-department/staff-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { staffRequests } from "@/lib/db/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { z } from "zod";

// Validation schema for creating a staff request
const createStaffRequestSchema = z.object({
  positionTitle: z
    .string()
    .min(1, "Position title is required")
    .max(255, "Position title too long"),
  positionDescription: z
    .string()
    .min(1, "Position description is required"),
  numberOfStaff: z
    .number()
    .min(1, "At least 1 staff required")
    .max(10, "Maximum 10 staff per request")
    .default(1),
  skillsRequired: z.string().optional(),
  qualificationsRequired: z.string().optional(),
  preferredGender: z.enum(["MALE", "FEMALE"]).optional(),
  urgency: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
});

// POST - Create a new staff request
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is SERVICE_DEPARTMENT
    if (
      !session ||
      !session.user ||
      session.user.type !== "SERVICE_DEPARTMENT"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body
    const parsed = createStaffRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Create the staff request
    const [newRequest] = await db
      .insert(staffRequests)
      .values({
        serviceDepartmentId: session.user.id,
        positionTitle: data.positionTitle,
        positionDescription: data.positionDescription,
        numberOfStaff: data.numberOfStaff,
        skillsRequired: data.skillsRequired || null,
        qualificationsRequired: data.qualificationsRequired || null,
        preferredGender: data.preferredGender || null,
        urgency: data.urgency,
        status: "Pending",
        fulfilledCount: 0,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Staff request created successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Create staff request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - List all staff requests for the service department
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is SERVICE_DEPARTMENT
    if (
      !session ||
      !session.user ||
      session.user.type !== "SERVICE_DEPARTMENT"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [eq(staffRequests.serviceDepartmentId, session.user.id)];
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

    // Get requests
    const requests = await db
      .select()
      .from(staffRequests)
      .where(and(...conditions))
      .orderBy(desc(staffRequests.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(staffRequests)
      .where(and(...conditions));

    const total = totalResult?.count || 0;

    // Get stats for this department
    const statsResult = await db
      .select({
        status: staffRequests.status,
        count: count(),
      })
      .from(staffRequests)
      .where(eq(staffRequests.serviceDepartmentId, session.user.id))
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

    return NextResponse.json({
      success: true,
      requests,
      stats,
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
