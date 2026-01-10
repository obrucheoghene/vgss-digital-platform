// src/app/api/service-department/staff/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData, users, chapters } from "@/lib/db/schema";
import { eq, desc, and, or, ilike, count } from "drizzle-orm";

// GET - List all VGSS staff assigned to the service department
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Build where conditions - staff assigned to this department
    const conditions = [eq(graduateData.serviceDepartmentId, session.user.id)];

    if (status && status !== "all") {
      conditions.push(
        eq(
          graduateData.status,
          status as
            | "Under Review"
            | "Invited For Interview"
            | "Interviewed"
            | "Sighting"
            | "Serving"
            | "Not Accepted"
        )
      );
    }

    if (search) {
      const searchCondition = or(
        ilike(graduateData.graduateFirstname, `%${search}%`),
        ilike(graduateData.graduateSurname, `%${search}%`),
        ilike(graduateData.email, `%${search}%`),
        ilike(graduateData.courseOfStudy, `%${search}%`),
        ilike(graduateData.nameOfUniversity, `%${search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const whereClause = and(...conditions);

    // Get staff with related info
    const staff = await db
      .select({
        id: graduateData.id,
        graduateFirstname: graduateData.graduateFirstname,
        graduateSurname: graduateData.graduateSurname,
        email: graduateData.email,
        graduateGender: graduateData.graduateGender,
        graduatePhoneNumber: graduateData.graduatePhoneNumber,
        maritalStatus: graduateData.maritalStatus,
        dateOfBirth: graduateData.dateOfBirth,
        stateOfOrigin: graduateData.stateOfOrigin,
        homeAddress: graduateData.homeAddress,
        nameOfUniversity: graduateData.nameOfUniversity,
        courseOfStudy: graduateData.courseOfStudy,
        graduationYear: graduateData.graduationYear,
        grade: graduateData.grade,
        nyscStatus: graduateData.nyscStatus,
        nameOfZone: graduateData.nameOfZone,
        skillsPossessed: graduateData.skillsPossessed,
        status: graduateData.status,
        serviceStartedDate: graduateData.serviceStartedDate,
        serviceCompletedDate: graduateData.serviceCompletedDate,
        photo: graduateData.photo,
        createdAt: graduateData.createdAt,
        updatedAt: graduateData.updatedAt,
      })
      .from(graduateData)
      .where(whereClause)
      .orderBy(desc(graduateData.serviceStartedDate))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(graduateData)
      .where(whereClause);

    const total = totalResult?.count || 0;

    // Get stats for this department's staff
    const allStaff = await db
      .select({
        status: graduateData.status,
        graduateGender: graduateData.graduateGender,
      })
      .from(graduateData)
      .where(eq(graduateData.serviceDepartmentId, session.user.id));

    const stats = {
      total: allStaff.length,
      serving: allStaff.filter((s) => s.status === "Serving").length,
      completed: allStaff.filter((s) => s.status === "Not Accepted").length, // Or use serviceCompletedDate
      male: allStaff.filter((s) => s.graduateGender === "MALE").length,
      female: allStaff.filter((s) => s.graduateGender === "FEMALE").length,
    };

    return NextResponse.json({
      success: true,
      staff,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get assigned staff error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
