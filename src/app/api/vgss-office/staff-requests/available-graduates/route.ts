// src/app/api/vgss-office/staff-requests/available-graduates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData } from "@/lib/db/schema";
import { eq, and, isNull, or, ilike, count } from "drizzle-orm";

// GET - List graduates available for assignment
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is VGSS_OFFICE
    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const gender = searchParams.get("gender");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Build where conditions
    // Available graduates are:
    // - Approved (isApproved = true)
    // - Not already assigned to a service department (serviceDepartmentId IS NULL)
    // - Status is either "Interviewed", "Sighting", or "Serving" (but not yet assigned)
    const conditions = [
      eq(graduateData.isApproved, true),
      isNull(graduateData.serviceDepartmentId),
      or(
        eq(graduateData.status, "Interviewed"),
        eq(graduateData.status, "Sighting")
      ),
    ];

    if (gender && gender !== "all") {
      conditions.push(
        eq(graduateData.graduateGender, gender as "MALE" | "FEMALE")
      );
    }

    if (search) {
      conditions.push(
        or(
          ilike(graduateData.graduateFirstname, `%${search}%`),
          ilike(graduateData.graduateSurname, `%${search}%`),
          ilike(graduateData.email, `%${search}%`),
          ilike(graduateData.skillsPossessed, `%${search}%`)
        )
      );
    }

    const whereClause = and(...conditions);

    // Get available graduates with zone info
    const graduates = await db
      .select({
        id: graduateData.id,
        graduateFirstname: graduateData.graduateFirstname,
        graduateSurname: graduateData.graduateSurname,
        email: graduateData.email,
        graduateGender: graduateData.graduateGender,
        graduatePhoneNumber: graduateData.graduatePhoneNumber,
        nameOfUniversity: graduateData.nameOfUniversity,
        courseOfStudy: graduateData.courseOfStudy,
        graduationYear: graduateData.graduationYear,
        skillsPossessed: graduateData.skillsPossessed,
        status: graduateData.status,
        nameOfZone: graduateData.nameOfZone,
        createdAt: graduateData.createdAt,
      })
      .from(graduateData)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(graduateData)
      .where(whereClause);

    const total = totalResult?.count || 0;

    return NextResponse.json({
      success: true,
      graduates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get available graduates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
