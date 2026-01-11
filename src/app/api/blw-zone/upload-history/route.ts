// src/app/api/blw-zone/upload-history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadHistory, zoneGraduates } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is BLW_ZONE
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get upload history from the upload_history table
    const history = await db
      .select({
        id: uploadHistory.id,
        filename: uploadHistory.filename,
        totalRecords: uploadHistory.totalRecords,
        successfulRecords: uploadHistory.successfulRecords,
        failedRecords: uploadHistory.failedRecords,
        duplicateRecords: uploadHistory.duplicateRecords,
        status: uploadHistory.status,
        errors: uploadHistory.errors,
        createdAt: uploadHistory.createdAt,
      })
      .from(uploadHistory)
      .where(eq(uploadHistory.userId, session.user.id))
      .orderBy(desc(uploadHistory.createdAt))
      .limit(50);

    // Parse errors JSON for each record
    const historyWithParsedErrors = history.map((record) => ({
      ...record,
      errors: record.errors ? JSON.parse(record.errors) : [],
    }));

    // Get total counts for summary
    const [totalStats] = await db
      .select({
        totalUploaded: count(),
      })
      .from(zoneGraduates)
      .where(eq(zoneGraduates.userId, session.user.id));

    return NextResponse.json({
      success: true,
      history: historyWithParsedErrors,
      totalUploaded: totalStats?.totalUploaded || 0,
    });
  } catch (error) {
    console.error("Upload history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
