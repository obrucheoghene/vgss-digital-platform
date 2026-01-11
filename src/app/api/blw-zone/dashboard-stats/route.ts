import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData, zoneGraduates, chapters } from "@/lib/db/schema";
import { count, eq, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalUploadedGraduates,
      registeredGraduates,
      chaptersCount,
      recentUploads,
      recentRegistrations,
    ] = await Promise.all([
      // Total uploaded graduates
      db
        .select({
          count: count(),
        })
        .from(zoneGraduates)
        .where(eq(zoneGraduates.userId, session.user.id)),

      // Registered graduates with status
      db
        .select({
          id: graduateData.id,
          graduateFirstname: graduateData.graduateFirstname,
          graduateSurname: graduateData.graduateSurname,
          status: graduateData.status,
          serviceStartedDate: graduateData.serviceStartedDate,
          createdAt: graduateData.createdAt,
          chapterId: graduateData.chapterId,
        })
        .from(graduateData)
        .where(eq(graduateData.blwZoneId, session.user.id)),

      // Chapters count
      db
        .select({
          count: count(),
        })
        .from(chapters)
        .where(eq(chapters.userId, session.user.id)),

      // Recent uploads (last 5)
      db
        .select({
          id: zoneGraduates.id,
          graduateFirstname: zoneGraduates.graduateFirstname,
          graduateSurname: zoneGraduates.graduateSurname,
          graduatePhoneNumber: zoneGraduates.graduatePhoneNumber,
          nameOfUniversity: zoneGraduates.nameOfUniversity,
          courseOfStudy: zoneGraduates.courseOfStudy,
          isRegistered: zoneGraduates.isRegistered,
          createdAt: zoneGraduates.createdAt,
          chapterName: chapters.name,
        })
        .from(zoneGraduates)
        .leftJoin(chapters, eq(zoneGraduates.chapterId, chapters.id))
        .where(eq(zoneGraduates.userId, session.user.id))
        .orderBy(desc(zoneGraduates.createdAt))
        .limit(5),

      // Recent registrations (last 5)
      db
        .select({
          id: graduateData.id,
          graduateFirstname: graduateData.graduateFirstname,
          graduateSurname: graduateData.graduateSurname,
          email: graduateData.email,
          status: graduateData.status,
          createdAt: graduateData.createdAt,
          chapterName: chapters.name,
        })
        .from(graduateData)
        .leftJoin(chapters, eq(graduateData.chapterId, chapters.id))
        .where(eq(graduateData.blwZoneId, session.user.id))
        .orderBy(desc(graduateData.createdAt))
        .limit(5),
    ]);

    // Calculate status breakdown
    const statusBreakdown = {
      "Under Review": 0,
      "Invited For Interview": 0,
      Interviewed: 0,
      Sighting: 0,
      Serving: 0,
      "Not Accepted": 0,
    };

    registeredGraduates.forEach((grad) => {
      if (grad.status && statusBreakdown.hasOwnProperty(grad.status)) {
        statusBreakdown[grad.status as keyof typeof statusBreakdown]++;
      }
    });

    const graduatesInService = registeredGraduates.filter(
      (value) => value.status === "Serving"
    );

    const pendingRegistration =
      (totalUploadedGraduates[0]?.count || 0) - registeredGraduates.length;

    const stats = {
      totalUploadedGraduates: totalUploadedGraduates[0]?.count || 0,
      totalRegisteredGraduates: registeredGraduates.length,
      totalInServiceGraduates: graduatesInService.length,
      totalPendingRegisteredGraduates: Math.max(0, pendingRegistration),
      totalChapters: chaptersCount[0]?.count || 0,
      statusBreakdown,
    };

    return NextResponse.json({
      success: true,
      stats,
      recentUploads,
      recentRegistrations,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
