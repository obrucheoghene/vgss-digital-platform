import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chapters, graduateData, zoneGraduates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [uploadedGraudates, registeredGraduates] = await Promise.all([
      db
        .select({
          id: zoneGraduates.id,
          graduateFirstname: zoneGraduates.graduateFirstname,
          graduateSurname: zoneGraduates.graduateSurname,
          graduateGender: zoneGraduates.graduateGender,
          graduatePhoneNumber: zoneGraduates.graduatePhoneNumber,
          nameOfUniversity: zoneGraduates.nameOfUniversity,
          courseOfStudy: zoneGraduates.courseOfStudy,
          graduationYear: zoneGraduates.graduationYear,
          nameOfFellowship: zoneGraduates.chapterId,
          chapterId: zoneGraduates.chapterId,
          nameOfZonalPastor: zoneGraduates.nameOfZonalPastor,
          nameOfChapterPastor: zoneGraduates.nameOfChapterPastor,
          phoneNumberOfChapterPastor: zoneGraduates.phoneNumberOfChapterPastor,
          kingschatIDOfChapterPastor: zoneGraduates.kingschatIDOfChapterPastor,
          registeredAt: zoneGraduates.registeredAt,
          chapter: chapters.name,
        })
        .from(zoneGraduates)
        .innerJoin(chapters, eq(zoneGraduates.chapterId, chapters.id))
        .where(eq(zoneGraduates.userId, session.user.id)),

      db
        .select({
          id: graduateData.id,
          graduateFirstname: graduateData.graduateFirstname,
          graduateSurname: graduateData.graduateSurname,
          graduateGender: graduateData.graduateGender,
          graduatePhoneNumber: graduateData.graduatePhoneNumber,
          graduateEmail: graduateData.email,
          nameOfUniversity: graduateData.nameOfUniversity,
          courseOfStudy: graduateData.courseOfStudy,
          graduationYear: graduateData.graduationYear,
          nameOfFellowship: graduateData.chapterId,
          chapterId: graduateData.chapterId,
          nameOfZonalPastor: graduateData.nameOfZonalPastor,
          nameOfChapterPastor: graduateData.nameOfChapterPastor,
          phoneNumberOfChapterPastor: graduateData.phoneNumberOfChapterPastor,
          emailOfChapterPastor: graduateData.emailOfChapterPastor,
          serviceStartedDate: graduateData.serviceStartedDate,
          serviceCompletedDate: graduateData.serviceCompletedDate,
          createdAt: graduateData.createdAt,
          status: graduateData.status,
        })
        .from(graduateData)
        .where(eq(graduateData.blwZoneId, session.user.id)),
    ]);

    return NextResponse.json({
      success: true,
      results: {
        uploadedGraudates,
        registeredGraduates,
      },
    });
  } catch (error) {
    console.error("blw-zone graduate error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
