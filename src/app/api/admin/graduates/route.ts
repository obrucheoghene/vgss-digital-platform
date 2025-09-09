import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graduateData, users, zoneGraduates } from "@/lib/db/schema";
import { eq, ilike, or, and, desc, count, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is VGSS_OFFICE
    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const zone = searchParams.get("zone");
    const gender = searchParams.get("gender");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          ilike(graduateData.graduateFirstname, `%${search}%`),
          ilike(graduateData.graduateSurname, `%${search}%`),
          ilike(graduateData.email, `%${search}%`),
          ilike(graduateData.nameOfFellowship, `%${search}%`),
          ilike(graduateData.nameOfZone, `%${search}%`)
        )
      );
    }

    // Status filter
    if (status && status !== "all") {
      conditions.push(eq(graduateData.status, status as any));
    }

    // Zone filter
    if (zone && zone !== "all") {
      conditions.push(eq(graduateData.nameOfZone, zone));
    }

    // Gender filter
    if (gender && gender !== "all") {
      conditions.push(eq(graduateData.graduateGender, gender as any));
    }

    // Execute query
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [graduatesList, totalCount] = await Promise.all([
      db
        .select({
          // Graduate data
          id: graduateData.id,
          userId: graduateData.userId,
          graduateFirstname: graduateData.graduateFirstname,
          graduateSurname: graduateData.graduateSurname,
          email: graduateData.email,
          graduateGender: graduateData.graduateGender,
          dateOfBirth: graduateData.dateOfBirth,
          graduatePhoneNumber: graduateData.graduatePhoneNumber,
          status: graduateData.status,
          isApproved: graduateData.isApproved,

          // Education info
          nameOfUniversity: graduateData.nameOfUniversity,
          courseOfStudy: graduateData.courseOfStudy,
          graduationYear: graduateData.graduationYear,
          grade: graduateData.grade,

          // Ministry info
          nameOfZone: graduateData.nameOfZone,
          nameOfFellowship: graduateData.nameOfFellowship,
          nameOfChapterPastor: graduateData.nameOfChapterPastor,

          // Service info
          serviceStartedDate: graduateData.serviceStartedDate,
          serviceCompletedDate: graduateData.serviceCompletedDate,

          // Metadata
          createdAt: graduateData.createdAt,
          updatedAt: graduateData.updatedAt,
          approvedAt: graduateData.approvedAt,

          // Zone info
          zoneName: users.name,
          zoneEmail: users.email,
        })
        .from(graduateData)
        .leftJoin(users, eq(graduateData.blwZoneId, users.id))
        .where(whereClause)
        .orderBy(desc(graduateData.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(graduateData)
        .where(whereClause)
        .then((result) => result[0]?.count || 0),
    ]);

    // Get graduate statistics
    const stats = await db
      .select({
        status: graduateData.status,
        gender: graduateData.graduateGender,
        isApproved: graduateData.isApproved,
      })
      .from(graduateData);

    const graduateStats = {
      total: stats.length,
      approved: stats.filter((g) => g.isApproved).length,
      pending: stats.filter((g) => !g.isApproved).length,
      byStatus: {
        "Under Review": stats.filter((g) => g.status === "Under Review").length,
        "Invited For Interview": stats.filter(
          (g) => g.status === "Invited For Interview"
        ).length,
        Interviewed: stats.filter((g) => g.status === "Interviewed").length,
        Sighting: stats.filter((g) => g.status === "Sighting").length,
        Serving: stats.filter((g) => g.status === "Serving").length,
        "Not Accepted": stats.filter((g) => g.status === "Not Accepted").length,
      },
      byGender: {
        MALE: stats.filter((g) => g.gender === "MALE").length,
        FEMALE: stats.filter((g) => g.gender === "FEMALE").length,
      },
    };

    // Get unique zones for filtering
    const zones = await db
      .selectDistinct({ zone: graduateData.nameOfZone })
      .from(graduateData)
      .orderBy(graduateData.nameOfZone);

    return NextResponse.json({
      success: true,
      graduates: graduatesList,
      stats: graduateStats,
      zones: zones.map((z) => z.zone).filter(Boolean),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching graduates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
