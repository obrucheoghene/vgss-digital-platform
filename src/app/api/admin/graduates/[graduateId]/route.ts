import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ graduateId: string }> }
) {
  try {
    const { graduateId } = await params;

    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const graduate = await db
      .select({
        // Personal Information
        id: graduateData.id,
        userId: graduateData.userId,
        graduateFirstname: graduateData.graduateFirstname,
        graduateLastname: graduateData.graduateSurname,
        graduateGender: graduateData.graduateGender,
        maritalStatus: graduateData.maritalStatus,
        dateOfBirth: graduateData.dateOfBirth,
        placeOfBirth: graduateData.placeOfBirth,
        stateOfOrigin: graduateData.stateOfOrigin,
        homeAddress: graduateData.homeAddress,
        graduatePhoneNumber: graduateData.graduatePhoneNumber,
        email: graduateData.email,

        // Education
        nameOfUniversity: graduateData.nameOfUniversity,
        courseOfStudy: graduateData.courseOfStudy,
        graduationYear: graduateData.graduationYear,
        grade: graduateData.grade,
        nyscStatus: graduateData.nyscStatus,

        // Ministry Information
        nameOfZone: graduateData.nameOfZone,
        chapterId: graduateData.chapterId,
        nameOfZonalPastor: graduateData.nameOfZonalPastor,
        nameOfChapterPastor: graduateData.nameOfChapterPastor,
        phoneNumberOfChapterPastor: graduateData.phoneNumberOfChapterPastor,
        emailOfChapterPastor: graduateData.emailOfChapterPastor,

        // Spiritual Journey
        whereWhenChrist: graduateData.whereWhenChrist,
        whereWhenHolyGhost: graduateData.whereWhenHolyGhost,
        whereWhenBaptism: graduateData.whereWhenBaptism,
        whereWhenFoundationSchool: graduateData.whereWhenFoundationSchool,

        // Family Information
        fatherName: graduateData.fatherName,
        fatherPhoneNumber: graduateData.fatherPhoneNumber,
        fatherOccupation: graduateData.fatherOccupation,
        motherName: graduateData.motherName,
        motherPhoneNumber: graduateData.motherPhoneNumber,
        motherOccupation: graduateData.motherOccupation,
        howManyInFamily: graduateData.howManyInFamily,
        whatPositionInFamily: graduateData.whatPositionInFamily,
        familyResidence: graduateData.familyResidence,

        // Test Questions
        visionMissionPurpose: graduateData.visionMissionPurpose,
        explainWithExamples: graduateData.explainWithExamples,
        partnershipArms: graduateData.partnershipArms,
        fullMeaning: graduateData.fullMeaning,
        variousTasksResponsibleFor: graduateData.variousTasksResponsibleFor,
        projectProudOfAndRolePlayed: graduateData.projectProudOfAndRolePlayed,
        exampleDifficultSituation: graduateData.exampleDifficultSituation,
        recentConflict: graduateData.recentConflict,
        convictions: graduateData.convictions,
        whyVgss: graduateData.whyVgss,
        plansAfterVgss: graduateData.plansAfterVgss,

        // Status and Management
        status: graduateData.status,
        comments: graduateData.comments,
        isApproved: graduateData.isApproved,
        approvedBy: graduateData.approvedBy,
        approvedAt: graduateData.approvedAt,
        serviceStartedDate: graduateData.serviceStartedDate,
        serviceCompletedDate: graduateData.serviceCompletedDate,

        // Metadata
        createdAt: graduateData.createdAt,
        updatedAt: graduateData.updatedAt,

        // Zone Information
        zoneName: users.name,
        zoneEmail: users.email,
      })
      .from(graduateData)
      .leftJoin(users, eq(graduateData.blwZoneId, users.id))
      .where(eq(graduateData.id, graduateId))
      .limit(1);

    if (!graduate.length) {
      return NextResponse.json(
        { error: "Graduate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      graduate: graduate[0],
    });
  } catch (error) {
    console.error("Error fetching graduate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ graduateId: string }> }
) {
  try {
    const { graduateId } = await params;

    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, ...updateData } = await req.json();

    let updatedGraduate;

    // Handle different actions
    switch (action) {
      case "update_status":
        updatedGraduate = await db
          .update(graduateData)
          .set({
            status: updateData.status,
            comments: updateData.comments || null,
            updatedAt: new Date(),
          })
          .where(eq(graduateData.id, graduateId))
          .returning();
        break;

      case "approve":
        // Get current graduate to preserve status if not specified
        const [currentGraduate] = await db
          .select({ status: graduateData.status })
          .from(graduateData)
          .where(eq(graduateData.id, graduateId));

        updatedGraduate = await db
          .update(graduateData)
          .set({
            isApproved: true,
            approvedBy: session.user.id,
            approvedAt: new Date(),
            // Keep current status or use provided valid status, default to "Interviewed" for approved graduates
            status: updateData.status || currentGraduate?.status || "Interviewed",
            comments: updateData.comments || null,
            updatedAt: new Date(),
          })
          .where(eq(graduateData.id, graduateId))
          .returning();
        break;

      case "reject":
        updatedGraduate = await db
          .update(graduateData)
          .set({
            isApproved: false,
            status: "Not Accepted",
            comments: updateData.comments || "Application rejected",
            updatedAt: new Date(),
          })
          .where(eq(graduateData.id, graduateId))
          .returning();
        break;

      case "start_service":
        updatedGraduate = await db
          .update(graduateData)
          .set({
            status: "Serving",
            serviceStartedDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(graduateData.id, graduateId))
          .returning();
        break;

      case "complete_service":
        updatedGraduate = await db
          .update(graduateData)
          .set({
            serviceCompletedDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(graduateData.id, graduateId))
          .returning();
        break;

      case "add_comments":
        updatedGraduate = await db
          .update(graduateData)
          .set({
            comments: updateData.comments,
            updatedAt: new Date(),
          })
          .where(eq(graduateData.id, graduateId))
          .returning();
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!updatedGraduate || updatedGraduate.length === 0) {
      return NextResponse.json(
        { error: "Graduate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Graduate updated successfully",
      graduate: updatedGraduate[0],
    });
  } catch (error) {
    console.error("Error updating graduate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
