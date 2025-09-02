import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData, zoneGraduates } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const [totalUploadedGraduates, registeredGraduates] = await Promise.all([
      db
        .select({
          count: count(),
        })
        .from(zoneGraduates)
        .where(eq(zoneGraduates.userId, session.user.id)),

      db
        .select({
          id: graduateData.id,
          zoneGraduateId: graduateData.zoneGraduateId,
          serviceStartedDate: graduateData.serviceStartedDate,
        })
        .from(graduateData)
        .where(eq(graduateData.blwZoneId, session.user.id)),
    ]);
    const graduatesInService = registeredGraduates.filter(
      (value) => value.serviceStartedDate
    );
    const stats = {
      totalUploadedGraduates: totalUploadedGraduates[0]?.count || 0,
      totalRegisteredGraduates: registeredGraduates.length,
      totalInServiceGraduates: graduatesInService.length,
      totalPendingRegisteredGraduates:
        registeredGraduates.length - graduatesInService.length,
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
