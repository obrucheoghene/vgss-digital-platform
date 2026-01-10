// src/app/api/vgss-office/staff-requests/[requestId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  staffRequests,
  staffRequestAssignments,
  graduateData,
  users,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// GET - Get staff request details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await params;

    // Get the request with department info
    const [request] = await db
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
      .where(eq(staffRequests.id, requestId));

    if (!request) {
      return NextResponse.json(
        { error: "Staff request not found" },
        { status: 404 }
      );
    }

    // Get assigned graduates
    const assignments = await db
      .select({
        id: staffRequestAssignments.id,
        graduateDataId: staffRequestAssignments.graduateDataId,
        assignedBy: staffRequestAssignments.assignedBy,
        assignedAt: staffRequestAssignments.assignedAt,
        notes: staffRequestAssignments.notes,
        graduateFirstname: graduateData.graduateFirstname,
        graduateSurname: graduateData.graduateSurname,
        graduateEmail: graduateData.email,
        graduateGender: graduateData.graduateGender,
        graduatePhone: graduateData.graduatePhoneNumber,
      })
      .from(staffRequestAssignments)
      .leftJoin(
        graduateData,
        eq(staffRequestAssignments.graduateDataId, graduateData.id)
      )
      .where(eq(staffRequestAssignments.staffRequestId, requestId));

    // Get approver info if approved
    let approver = null;
    if (request.approvedBy) {
      const [approverResult] = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, request.approvedBy));
      approver = approverResult;
    }

    return NextResponse.json({
      success: true,
      request: {
        ...request,
        approverName: approver?.name,
        approverEmail: approver?.email,
      },
      assignments,
    });
  } catch (error) {
    console.error("Get staff request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Action schemas
const approveSchema = z.object({
  action: z.literal("approve"),
  notes: z.string().optional(),
});

const rejectSchema = z.object({
  action: z.literal("reject"),
  rejectionReason: z.string().min(1, "Rejection reason is required"),
});

const assignSchema = z.object({
  action: z.literal("assign"),
  graduateDataId: z.string().uuid("Invalid graduate ID"),
  notes: z.string().optional(),
});

const addNotesSchema = z.object({
  action: z.literal("add_notes"),
  notes: z.string(),
});

const cancelSchema = z.object({
  action: z.literal("cancel"),
});

// PATCH - Perform actions on staff request
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await params;
    const body = await req.json();

    // Get the current request
    const [currentRequest] = await db
      .select()
      .from(staffRequests)
      .where(eq(staffRequests.id, requestId));

    if (!currentRequest) {
      return NextResponse.json(
        { error: "Staff request not found" },
        { status: 404 }
      );
    }

    const action = body.action;

    switch (action) {
      case "approve": {
        const parsed = approveSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { error: parsed.error.issues[0].message },
            { status: 400 }
          );
        }

        if (currentRequest.status !== "Pending") {
          return NextResponse.json(
            { error: "Only pending requests can be approved" },
            { status: 400 }
          );
        }

        const [updated] = await db
          .update(staffRequests)
          .set({
            status: "Approved",
            approvedBy: session.user.id,
            approvedAt: new Date(),
            notes: parsed.data.notes || currentRequest.notes,
            updatedAt: new Date(),
          })
          .where(eq(staffRequests.id, requestId))
          .returning();

        return NextResponse.json({
          success: true,
          message: "Staff request approved",
          request: updated,
        });
      }

      case "reject": {
        const parsed = rejectSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { error: parsed.error.issues[0].message },
            { status: 400 }
          );
        }

        if (currentRequest.status !== "Pending") {
          return NextResponse.json(
            { error: "Only pending requests can be rejected" },
            { status: 400 }
          );
        }

        const [updated] = await db
          .update(staffRequests)
          .set({
            status: "Rejected",
            rejectionReason: parsed.data.rejectionReason,
            approvedBy: session.user.id,
            approvedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(staffRequests.id, requestId))
          .returning();

        return NextResponse.json({
          success: true,
          message: "Staff request rejected",
          request: updated,
        });
      }

      case "assign": {
        const parsed = assignSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { error: parsed.error.issues[0].message },
            { status: 400 }
          );
        }

        if (currentRequest.status !== "Approved") {
          return NextResponse.json(
            { error: "Only approved requests can have graduates assigned" },
            { status: 400 }
          );
        }

        if (currentRequest.fulfilledCount >= currentRequest.numberOfStaff) {
          return NextResponse.json(
            { error: "This request has already been fulfilled" },
            { status: 400 }
          );
        }

        // Check if graduate is already assigned to this request
        const [existingAssignment] = await db
          .select()
          .from(staffRequestAssignments)
          .where(
            and(
              eq(staffRequestAssignments.staffRequestId, requestId),
              eq(
                staffRequestAssignments.graduateDataId,
                parsed.data.graduateDataId
              )
            )
          );

        if (existingAssignment) {
          return NextResponse.json(
            { error: "Graduate is already assigned to this request" },
            { status: 400 }
          );
        }

        // Check if graduate exists and is available
        const [graduate] = await db
          .select()
          .from(graduateData)
          .where(eq(graduateData.id, parsed.data.graduateDataId));

        if (!graduate) {
          return NextResponse.json(
            { error: "Graduate not found" },
            { status: 404 }
          );
        }

        if (graduate.serviceDepartmentId) {
          return NextResponse.json(
            { error: "Graduate is already assigned to another department" },
            { status: 400 }
          );
        }

        // Use a transaction to ensure data consistency
        await db.transaction(async (tx) => {
          // Create assignment
          await tx.insert(staffRequestAssignments).values({
            staffRequestId: requestId,
            graduateDataId: parsed.data.graduateDataId,
            assignedBy: session.user.id,
            notes: parsed.data.notes || null,
          });

          // Update graduate's service department
          await tx
            .update(graduateData)
            .set({
              serviceDepartmentId: currentRequest.serviceDepartmentId,
              status: "Serving",
              serviceStartedDate: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(graduateData.id, parsed.data.graduateDataId));

          // Update request fulfilled count
          const newFulfilledCount = currentRequest.fulfilledCount + 1;
          const isFullyFulfilled =
            newFulfilledCount >= currentRequest.numberOfStaff;

          await tx
            .update(staffRequests)
            .set({
              fulfilledCount: newFulfilledCount,
              status: isFullyFulfilled ? "Fulfilled" : "Approved",
              fulfilledAt: isFullyFulfilled ? new Date() : null,
              updatedAt: new Date(),
            })
            .where(eq(staffRequests.id, requestId));
        });

        // Get updated request
        const [updatedRequest] = await db
          .select()
          .from(staffRequests)
          .where(eq(staffRequests.id, requestId));

        return NextResponse.json({
          success: true,
          message: "Graduate assigned successfully",
          request: updatedRequest,
        });
      }

      case "add_notes": {
        const parsed = addNotesSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { error: parsed.error.issues[0].message },
            { status: 400 }
          );
        }

        const [updated] = await db
          .update(staffRequests)
          .set({
            notes: parsed.data.notes,
            updatedAt: new Date(),
          })
          .where(eq(staffRequests.id, requestId))
          .returning();

        return NextResponse.json({
          success: true,
          message: "Notes updated",
          request: updated,
        });
      }

      case "cancel": {
        const parsed = cancelSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { error: parsed.error.issues[0].message },
            { status: 400 }
          );
        }

        if (currentRequest.status !== "Pending") {
          return NextResponse.json(
            { error: "Only pending requests can be cancelled" },
            { status: 400 }
          );
        }

        const [updated] = await db
          .update(staffRequests)
          .set({
            status: "Cancelled",
            updatedAt: new Date(),
          })
          .where(eq(staffRequests.id, requestId))
          .returning();

        return NextResponse.json({
          success: true,
          message: "Staff request cancelled",
          request: updated,
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Staff request action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
