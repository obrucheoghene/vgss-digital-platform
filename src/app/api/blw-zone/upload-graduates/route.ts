// src/app/api/blw-zone/upload-graduates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { zoneGraduates, uploadHistory } from "@/lib/db/schema";
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

    // Create upload history record
    const [historyRecord] = await db
      .insert(uploadHistory)
      .values({
        userId: session.user.id,
        filename: filename || "bulk_upload.csv",
        totalRecords: graduates.length,
        status: "processing",
      })
      .returning();

    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process each graduate record
    for (let i = 0; i < graduates.length; i++) {
      const graduate = graduates[i];

      try {
        // Validate phone number starts with +234
        if (
          !graduate.graduatePhoneNumber ||
          !graduate.graduatePhoneNumber.startsWith("+234")
        ) {
          errorCount++;
          errors.push(
            `Row ${i + 1}: Phone number must start with +234`
          );
          continue;
        }

        // Check for duplicate (same phone number for this zone)
        const existing = await db
          .select()
          .from(zoneGraduates)
          .where(
            and(
              eq(zoneGraduates.userId, session.user.id),
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

        // Validate required fields
        if (!graduate.graduateFirstname || !graduate.graduateSurname) {
          errorCount++;
          errors.push(`Row ${i + 1}: First name and surname are required`);
          continue;
        }

        if (!graduate.chapterId) {
          errorCount++;
          errors.push(`Row ${i + 1}: Chapter is required`);
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
          graduationYear: parseInt(graduate.graduationYear) || new Date().getFullYear(),
          chapterId: graduate.chapterId,
          nameOfZonalPastor: graduate.nameOfZonalPastor,
          nameOfChapterPastor: graduate.nameOfChapterPastor,
          phoneNumberOfChapterPastor: graduate.phoneNumberOfChapterPastor,
          kingschatIDOfChapterPastor:
            graduate.kingschatIDOfChapterPastor || "",
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

    // Update upload history record with results
    const finalStatus =
      errorCount === graduates.length ? "failed" : "completed";

    await db
      .update(uploadHistory)
      .set({
        successfulRecords: successCount,
        failedRecords: errorCount,
        duplicateRecords: duplicateCount,
        status: finalStatus,
        errors: errors.length > 0 ? JSON.stringify(errors.slice(0, 50)) : null,
        updatedAt: new Date(),
      })
      .where(eq(uploadHistory.id, historyRecord.id));

    return NextResponse.json({
      success: true,
      message: `Upload completed: ${successCount} records added, ${duplicateCount} duplicates skipped, ${errorCount} errors`,
      successCount,
      duplicateCount,
      errorCount,
      errors: errors.slice(0, 10), // Limit errors shown
      filename,
      historyId: historyRecord.id,
    });
  } catch (error) {
    console.error("Graduate upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
