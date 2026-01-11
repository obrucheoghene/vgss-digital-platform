// src/app/api/graduate/dashboard/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData, users, chapters } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET - Get dashboard data for the logged-in graduate
export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated and is a GRADUATE
    if (!session || !session.user || session.user.type !== "GRADUATE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the graduate's data
    const [graduate] = await db
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
        nameOfZone: graduateData.nameOfZone,
        chapterId: graduateData.chapterId,
        nameOfZonalPastor: graduateData.nameOfZonalPastor,
        nameOfChapterPastor: graduateData.nameOfChapterPastor,
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
        serviceDepartmentId: graduateData.serviceDepartmentId,
        createdAt: graduateData.createdAt,
        updatedAt: graduateData.updatedAt,
      })
      .from(graduateData)
      .where(eq(graduateData.userId, session.user.id));

    if (!graduate) {
      return NextResponse.json(
        { error: "Graduate profile not found" },
        { status: 404 }
      );
    }

    // Get chapter name if available
    let chapterName = null;
    if (graduate.chapterId) {
      const [chapter] = await db
        .select({ name: chapters.name })
        .from(chapters)
        .where(eq(chapters.id, graduate.chapterId));
      chapterName = chapter?.name;
    }

    // Get service department name if assigned
    let serviceDepartmentName = null;
    if (graduate.serviceDepartmentId) {
      const [department] = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, graduate.serviceDepartmentId));
      serviceDepartmentName = department?.name;
    }

    // Calculate service progress
    let serviceProgress = 0;
    let serviceDaysCompleted = 0;
    const totalServiceDays = 365;

    if (graduate.serviceStartedDate) {
      const startDate = new Date(graduate.serviceStartedDate);
      const today = new Date();
      const endDate = graduate.serviceCompletedDate
        ? new Date(graduate.serviceCompletedDate)
        : today;

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      serviceDaysCompleted = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      serviceProgress = Math.min(
        Math.round((serviceDaysCompleted / totalServiceDays) * 100),
        100
      );
    }

    // Calculate profile completion
    const profileFields = [
      graduate.graduateFirstname,
      graduate.graduateSurname,
      graduate.email,
      graduate.graduatePhoneNumber,
      graduate.dateOfBirth,
      graduate.stateOfOrigin,
      graduate.homeAddress,
      graduate.nameOfUniversity,
      graduate.courseOfStudy,
      graduate.photo,
      graduate.skillsPossessed,
    ];
    const completedFields = profileFields.filter(
      (field) => field !== null && field !== undefined && field !== ""
    ).length;
    const profileCompletion = Math.round(
      (completedFields / profileFields.length) * 100
    );

    return NextResponse.json({
      success: true,
      graduate: {
        ...graduate,
        chapterName,
        serviceDepartmentName,
      },
      stats: {
        serviceProgress,
        serviceDaysCompleted,
        totalServiceDays,
        profileCompletion,
      },
    });
  } catch (error) {
    console.error("Get graduate dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
