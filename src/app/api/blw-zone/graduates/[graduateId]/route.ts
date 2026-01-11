import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { zoneGraduates } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateGraduateSchema = z.object({
  graduateFirstname: z.string().min(1, "First name is required"),
  graduateSurname: z.string().min(1, "Surname is required"),
  graduateGender: z.enum(["MALE", "FEMALE"]),
  graduatePhoneNumber: z.string().min(1, "Phone number is required"),
  nameOfUniversity: z.string().min(1, "University name is required"),
  courseOfStudy: z.string().min(1, "Course of study is required"),
  graduationYear: z.number().min(1900).max(2100),
  chapterId: z.string().uuid("Invalid chapter ID"),
  nameOfZonalPastor: z.string().min(1, "Zonal pastor name is required"),
  nameOfChapterPastor: z.string().min(1, "Chapter pastor name is required"),
  phoneNumberOfChapterPastor: z.string().min(1, "Chapter pastor phone is required"),
  kingschatIDOfChapterPastor: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ graduateId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { graduateId } = await params;

    // Verify graduate belongs to this zone
    const existingGraduate = await db
      .select()
      .from(zoneGraduates)
      .where(
        and(
          eq(zoneGraduates.id, graduateId),
          eq(zoneGraduates.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingGraduate.length === 0) {
      return NextResponse.json(
        { error: "Graduate not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validatedData = updateGraduateSchema.parse(body);

    // Update the graduate
    await db
      .update(zoneGraduates)
      .set({
        graduateFirstname: validatedData.graduateFirstname,
        graduateSurname: validatedData.graduateSurname,
        graduateGender: validatedData.graduateGender,
        graduatePhoneNumber: validatedData.graduatePhoneNumber,
        nameOfUniversity: validatedData.nameOfUniversity,
        courseOfStudy: validatedData.courseOfStudy,
        graduationYear: validatedData.graduationYear,
        chapterId: validatedData.chapterId,
        nameOfZonalPastor: validatedData.nameOfZonalPastor,
        nameOfChapterPastor: validatedData.nameOfChapterPastor,
        phoneNumberOfChapterPastor: validatedData.phoneNumberOfChapterPastor,
        kingschatIDOfChapterPastor: validatedData.kingschatIDOfChapterPastor || "",
        updatedAt: new Date(),
      })
      .where(eq(zoneGraduates.id, graduateId));

    return NextResponse.json({
      success: true,
      message: "Graduate updated successfully",
    });
  } catch (error) {
    console.error("Graduate update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ graduateId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { graduateId } = await params;

    // Verify graduate belongs to this zone
    const existingGraduate = await db
      .select()
      .from(zoneGraduates)
      .where(
        and(
          eq(zoneGraduates.id, graduateId),
          eq(zoneGraduates.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingGraduate.length === 0) {
      return NextResponse.json(
        { error: "Graduate not found" },
        { status: 404 }
      );
    }

    // Delete the graduate
    await db.delete(zoneGraduates).where(eq(zoneGraduates.id, graduateId));

    return NextResponse.json({
      success: true,
      message: "Graduate deleted successfully",
    });
  } catch (error) {
    console.error("Graduate delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
