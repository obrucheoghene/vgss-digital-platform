/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/admin/graduates/bulk-actions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, graduateIds, data } = await req.json();

    if (
      !graduateIds ||
      !Array.isArray(graduateIds) ||
      graduateIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Graduate IDs are required" },
        { status: 400 }
      );
    }

    let updatedCount = 0;
    let updateData: any = { updatedAt: new Date() };

    switch (action) {
      case "approve_selected":
        updateData = {
          ...updateData,
          isApproved: true,
          approvedBy: session.user.id,
          approvedAt: new Date(),
          status: data?.status || "Approved",
          comments: data?.comments || null,
        };
        break;

      case "reject_selected":
        updateData = {
          ...updateData,
          isApproved: false,
          status: "Not Accepted",
          comments: data?.comments || "Bulk rejection",
        };
        break;

      case "update_status":
        if (!data?.status) {
          return NextResponse.json(
            { error: "Status is required for status update" },
            { status: 400 }
          );
        }
        updateData = {
          ...updateData,
          status: data.status,
          comments: data.comments || null,
        };
        break;

      case "invite_for_interview":
        updateData = {
          ...updateData,
          status: "Invited For Interview",
          comments: data?.comments || "Invited for interview",
        };
        break;

      case "mark_interviewed":
        updateData = {
          ...updateData,
          status: "Interviewed",
          comments: data?.comments || "Interview completed",
        };
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await db
      .update(graduateData)
      .set(updateData)
      .where(inArray(graduateData.id, graduateIds))
      .returning({ id: graduateData.id });

    updatedCount = result.length;

    const actionMessages = {
      approve_selected: "approved",
      reject_selected: "rejected",
      update_status: "status updated for",
      invite_for_interview: "invited for interview",
      mark_interviewed: "marked as interviewed",
    };

    return NextResponse.json({
      success: true,
      message: `Successfully ${
        actionMessages[action as keyof typeof actionMessages]
      } ${updatedCount} graduates`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
