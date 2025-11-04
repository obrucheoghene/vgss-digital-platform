// src/app/api/blw-zone/upload-graduates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { zoneGraduates } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is BLW_ZONE
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { graduates, filename } = await req.json();

    if (!graduates || !Array.isArray(graduates) || graduates.length === 0) {
      return NextResponse.json(
        { error: "No graduate data provided" },
        { status: 400 }
      );
    }

    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process each graduate record
    for (let i = 0; i < graduates.length; i++) {
      const graduate = graduates[i];

      try {
        // Check for duplicate (same name, fellowship, and zone)
        const existing = await db
          .select()
          .from(zoneGraduates)
          .where(
            and(
              eq(zoneGraduates.userId, session.user.id),
              // eq(zoneGraduates.graduateFirstname, graduate.graduateFirstname),
              // eq(zoneGraduates.graduateSurname, graduate.graduateSurname),
              eq(
                zoneGraduates.graduatePhoneNumber,
                graduate.graduatePhoneNumber
              )
            )
          )
          .limit(1);

        if (existing.length > 0) {
          duplicateCount++;
          continue;
        }

        // Insert new record
        await db.insert(zoneGraduates).values({
          userId: session.user.id,
          graduateFirstname: graduate.graduateFirstname,
          graduateSurname: graduate.graduateSurname,
          graduateGender: graduate.graduateGender,
          graduatePhoneNumber: graduate.graduatePhoneNumber,
          nameOfUniversity: graduate.nameOfUniversity,
          courseOfStudy: graduate.courseOfStudy,
          graduationYear: graduate.graduationYear,
          chapterId: graduate.chapterId,
          nameOfZonalPastor: graduate.nameOfZonalPastor,
          nameOfChapterPastor: graduate.nameOfChapterPastor,
          phoneNumberOfChapterPastor: graduate.phoneNumberOfChapterPastor,
          // emailOfChapterPastor: graduate.emailOfChapterPastor,
          kingschatIDOfChapterPastor:
            graduate.kingschatIDOfChapterPastor || null,
          isRegistered: false,
        });

        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(
          `Row ${i + 1}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        console.error(`Error inserting graduate ${i + 1}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Upload completed: ${successCount} records added, ${duplicateCount} duplicates skipped, ${errorCount} errors`,
      successCount,
      duplicateCount,
      errorCount,
      errors: errors.slice(0, 10), // Limit errors shown
      filename,
    });
  } catch (error) {
    console.error("Graduate upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
