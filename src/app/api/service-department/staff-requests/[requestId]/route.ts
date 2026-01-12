// src/app/api/service-department/staff-requests/[requestId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { staffRequests } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Validation schema for updating a staff request
const updateStaffRequestSchema = z.object({
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
    .max(10, "Maximum 10 staff per request"),
  skillsRequired: z.string().optional().nullable(),
  qualificationsRequired: z.string().optional().nullable(),
  preferredGender: z.enum(["MALE", "FEMALE"]).optional().nullable(),
  urgency: z.enum(["Low", "Medium", "High", "Urgent"]),
});

// PUT - Update a staff request (only if Pending)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await auth();

    if (
      !session ||
      !session.user ||
      session.user.type !== "SERVICE_DEPARTMENT"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await params;

    // Verify request exists and belongs to this department
    const existingRequest = await db
      .select()
      .from(staffRequests)
      .where(
        and(
          eq(staffRequests.id, requestId),
          eq(staffRequests.serviceDepartmentId, session.user.id)
        )
      )
      .limit(1);

    if (existingRequest.length === 0) {
      return NextResponse.json(
        { error: "Staff request not found" },
        { status: 404 }
      );
    }

    // Only allow editing if status is Pending
    if (existingRequest[0].status !== "Pending") {
      return NextResponse.json(
        { error: "Only pending requests can be edited" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = updateStaffRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Update the request
    const [updatedRequest] = await db
      .update(staffRequests)
      .set({
        positionTitle: data.positionTitle,
        positionDescription: data.positionDescription,
        numberOfStaff: data.numberOfStaff,
        skillsRequired: data.skillsRequired || null,
        qualificationsRequired: data.qualificationsRequired || null,
        preferredGender: data.preferredGender || null,
        urgency: data.urgency,
        updatedAt: new Date(),
      })
      .where(eq(staffRequests.id, requestId))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Staff request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update staff request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Cancel a staff request (only if Pending)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await auth();

    if (
      !session ||
      !session.user ||
      session.user.type !== "SERVICE_DEPARTMENT"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await params;

    // Verify request exists and belongs to this department
    const existingRequest = await db
      .select()
      .from(staffRequests)
      .where(
        and(
          eq(staffRequests.id, requestId),
          eq(staffRequests.serviceDepartmentId, session.user.id)
        )
      )
      .limit(1);

    if (existingRequest.length === 0) {
      return NextResponse.json(
        { error: "Staff request not found" },
        { status: 404 }
      );
    }

    // Only allow cancellation if status is Pending
    if (existingRequest[0].status !== "Pending") {
      return NextResponse.json(
        { error: "Only pending requests can be cancelled" },
        { status: 400 }
      );
    }

    // Update status to Cancelled
    const [cancelledRequest] = await db
      .update(staffRequests)
      .set({
        status: "Cancelled",
        updatedAt: new Date(),
      })
      .where(eq(staffRequests.id, requestId))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Staff request cancelled successfully",
      request: cancelledRequest,
    });
  } catch (error) {
    console.error("Cancel staff request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a staff request (only if Pending or Cancelled)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await auth();

    if (
      !session ||
      !session.user ||
      session.user.type !== "SERVICE_DEPARTMENT"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await params;

    // Verify request exists and belongs to this department
    const existingRequest = await db
      .select()
      .from(staffRequests)
      .where(
        and(
          eq(staffRequests.id, requestId),
          eq(staffRequests.serviceDepartmentId, session.user.id)
        )
      )
      .limit(1);

    if (existingRequest.length === 0) {
      return NextResponse.json(
        { error: "Staff request not found" },
        { status: 404 }
      );
    }

    // Only allow deletion if status is Pending or Cancelled
    if (!["Pending", "Cancelled"].includes(existingRequest[0].status)) {
      return NextResponse.json(
        { error: "Only pending or cancelled requests can be deleted" },
        { status: 400 }
      );
    }

    // Delete the request
    await db.delete(staffRequests).where(eq(staffRequests.id, requestId));

    return NextResponse.json({
      success: true,
      message: "Staff request deleted successfully",
    });
  } catch (error) {
    console.error("Delete staff request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
