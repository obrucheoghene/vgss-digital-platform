// src/app/api/service-department/staff/[staffId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData, chapters } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET - Get details of a specific staff member
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ staffId: string }> }
) {
  try {
    const session = await auth();

    // Check if user is authenticated and is SERVICE_DEPARTMENT
    if (
      !session ||
      !session.user ||
      session.user.type !== "SERVICE_DEPARTMENT"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { staffId } = await params;

    // Get the staff member - ensure they belong to this department
    const [staff] = await db
      .select({
        id: graduateData.id,
        graduateFirstname: graduateData.graduateFirstname,
        graduateSurname: graduateData.graduateSurname,
        email: graduateData.email,
        graduateGender: graduateData.graduateGender,
        graduatePhoneNumber: graduateData.graduatePhoneNumber,
        maritalStatus: graduateData.maritalStatus,
        placeOfBirth: graduateData.placeOfBirth,
        dateOfBirth: graduateData.dateOfBirth,
        stateOfOrigin: graduateData.stateOfOrigin,
        homeAddress: graduateData.homeAddress,
        preferredCityOfPosting: graduateData.preferredCityOfPosting,
        accommodation: graduateData.accommodation,
        whereAccommodation: graduateData.whereAccommodation,
        kindAccommodation: graduateData.kindAccommodation,
        nameOfZone: graduateData.nameOfZone,
        chapterId: graduateData.chapterId,
        nameOfZonalPastor: graduateData.nameOfZonalPastor,
        nameOfChapterPastor: graduateData.nameOfChapterPastor,
        phoneNumberOfChapterPastor: graduateData.phoneNumberOfChapterPastor,
        emailOfChapterPastor: graduateData.emailOfChapterPastor,
        nameOfUniversity: graduateData.nameOfUniversity,
        courseOfStudy: graduateData.courseOfStudy,
        graduationYear: graduateData.graduationYear,
        grade: graduateData.grade,
        nyscStatus: graduateData.nyscStatus,
        skillsPossessed: graduateData.skillsPossessed,
        leadershipRolesInMinistryAndFellowship:
          graduateData.leadershipRolesInMinistryAndFellowship,
        ministryProgramsAttended: graduateData.ministryProgramsAttended,
        photo: graduateData.photo,
        status: graduateData.status,
        serviceStartedDate: graduateData.serviceStartedDate,
        serviceCompletedDate: graduateData.serviceCompletedDate,
        createdAt: graduateData.createdAt,
        updatedAt: graduateData.updatedAt,
      })
      .from(graduateData)
      .where(
        and(
          eq(graduateData.id, staffId),
          eq(graduateData.serviceDepartmentId, session.user.id)
        )
      );

    if (!staff) {
      return NextResponse.json(
        { error: "Staff member not found or not assigned to your department" },
        { status: 404 }
      );
    }

    // Get chapter name if available
    let chapterName = null;
    if (staff.chapterId) {
      const [chapter] = await db
        .select({ name: chapters.name })
        .from(chapters)
        .where(eq(chapters.id, staff.chapterId));
      chapterName = chapter?.name;
    }

    return NextResponse.json({
      success: true,
      staff: {
        ...staff,
        chapterName,
      },
    });
  } catch (error) {
    console.error("Get staff detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
