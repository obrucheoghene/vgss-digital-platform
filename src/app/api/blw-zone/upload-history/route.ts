// src/app/api/blw-zone/upload-history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { zoneGraduates } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is BLW_ZONE
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get upload statistics grouped by date
    const uploadStats = await db
      .select({
        uploadDate: zoneGraduates.createdAt,
        totalRecords: count(),
      })
      .from(zoneGraduates)
      .where(eq(zoneGraduates.userId, session.user.id))
      .groupBy(zoneGraduates.createdAt)
      .orderBy(desc(zoneGraduates.createdAt))
      .limit(10);

    // Get recent uploads with detailed info
    const recentUploads = await db
      .select({
        id: zoneGraduates.id,
        graduateFirstname: zoneGraduates.graduateFirstname,
        graduateLastname: zoneGraduates.graduateLastname,
        nameOfFellowship: zoneGraduates.nameOfFellowship,
        isRegistered: zoneGraduates.isRegistered,
        registeredAt: zoneGraduates.registeredAt,
        createdAt: zoneGraduates.createdAt,
      })
      .from(zoneGraduates)
      .where(eq(zoneGraduates.userId, session.user.id))
      .orderBy(desc(zoneGraduates.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      uploadStats,
      recentUploads,
      totalUploaded: recentUploads.length,
      totalRegistered: recentUploads.filter((u) => u.isRegistered).length,
    });
  } catch (error) {
    console.error("Upload history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
