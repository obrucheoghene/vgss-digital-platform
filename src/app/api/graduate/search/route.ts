// src/app/api/graduate/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { zoneGraduates, users } from "@/lib/db/schema";
import { ilike, or, and, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const gender = searchParams.get("gender");
    const fellowship = searchParams.get("fellowship");

    // Validate required parameters
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // Build search conditions
    const searchConditions = [];
    const searchTerm = `%${query.trim()}%`;

    // Search in name fields and fellowship
    searchConditions.push(
      or(
        ilike(zoneGraduates.graduateFirstname, searchTerm),
        ilike(zoneGraduates.graduateLastname, searchTerm),
        ilike(zoneGraduates.nameOfFellowship, searchTerm),
        ilike(zoneGraduates.nameOfChapterPastor, searchTerm),
        ilike(zoneGraduates.nameOfZonalPastor, searchTerm)
      )
    );

    // Add gender filter if specified
    if (gender && gender !== "all") {
      searchConditions.push(
        eq(zoneGraduates.graduateGender, gender as "MALE" | "FEMALE")
      );
    }

    // Add fellowship filter if specified
    if (fellowship && fellowship !== "all") {
      searchConditions.push(eq(zoneGraduates.nameOfFellowship, fellowship));
    }

    // Execute search with joins to get zone information
    const results = await db
      .select({
        id: zoneGraduates.id,
        graduateFirstname: zoneGraduates.graduateFirstname,
        graduateLastname: zoneGraduates.graduateLastname,
        graduateGender: zoneGraduates.graduateGender,
        nameOfFellowship: zoneGraduates.nameOfFellowship,
        nameOfZonalPastor: zoneGraduates.nameOfZonalPastor,
        nameOfChapterPastor: zoneGraduates.nameOfChapterPastor,
        phoneNumberOfChapterPastor: zoneGraduates.phoneNumberOfChapterPastor,
        emailOfChapterPastor: zoneGraduates.emailOfChapterPastor,
        kingschatIDOfChapterPastor: zoneGraduates.kingschatIDOfChapterPastor,
        isRegistered: zoneGraduates.isRegistered,
        registeredAt: zoneGraduates.registeredAt,
        createdAt: zoneGraduates.createdAt,
        // Zone information
        zoneName: users.name,
        zoneEmail: users.email,
      })
      .from(zoneGraduates)
      .leftJoin(users, eq(zoneGraduates.userId, users.id))
      .where(and(...searchConditions))
      .limit(50) // Limit results to prevent overwhelming responses
      .orderBy(zoneGraduates.createdAt);

    // Format results for frontend
    const formattedResults = results.map((result) => ({
      id: result.id,
      graduateFirstname: result.graduateFirstname,
      graduateLastname: result.graduateLastname,
      graduateGender: result.graduateGender,
      nameOfFellowship: result.nameOfFellowship,
      nameOfZonalPastor: result.nameOfZonalPastor,
      nameOfChapterPastor: result.nameOfChapterPastor,
      phoneNumberOfChapterPastor: result.phoneNumberOfChapterPastor,
      emailOfChapterPastor: result.emailOfChapterPastor,
      kingschatIDOfChapterPastor: result.kingschatIDOfChapterPastor,
      isRegistered: result.isRegistered,
      registeredAt: result.registeredAt,
      createdAt: result.createdAt,
      zoneName: result.zoneName || "Unknown Zone",
      zoneEmail: result.zoneEmail,
    }));

    return NextResponse.json({
      success: true,
      results: formattedResults,
      count: formattedResults.length,
      searchQuery: query,
      filters: {
        gender: gender || "all",
        fellowship: fellowship || "all",
      },
    });
  } catch (error) {
    console.error("Graduate search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get unique fellowships for filter dropdown
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "get_fellowships") {
      // Get unique fellowships for filter dropdown
      const fellowships = await db
        .selectDistinct({ fellowship: zoneGraduates.nameOfFellowship })
        .from(zoneGraduates)
        .orderBy(zoneGraduates.nameOfFellowship);

      return NextResponse.json({
        success: true,
        fellowships: fellowships.map((f) => f.fellowship),
      });
    }

    if (action === "verify_record") {
      const { recordId } = body;

      if (!recordId) {
        return NextResponse.json(
          { error: "Record ID is required" },
          { status: 400 }
        );
      }

      // Get detailed record information for verification
      const record = await db
        .select({
          id: zoneGraduates.id,
          graduateFirstname: zoneGraduates.graduateFirstname,
          graduateLastname: zoneGraduates.graduateLastname,
          graduateGender: zoneGraduates.graduateGender,
          nameOfFellowship: zoneGraduates.nameOfFellowship,
          nameOfZonalPastor: zoneGraduates.nameOfZonalPastor,
          nameOfChapterPastor: zoneGraduates.nameOfChapterPastor,
          phoneNumberOfChapterPastor: zoneGraduates.phoneNumberOfChapterPastor,
          emailOfChapterPastor: zoneGraduates.emailOfChapterPastor,
          isRegistered: zoneGraduates.isRegistered,
          registeredAt: zoneGraduates.registeredAt,
          createdAt: zoneGraduates.createdAt,
          zoneName: users.name,
        })
        .from(zoneGraduates)
        .leftJoin(users, eq(zoneGraduates.userId, users.id))
        .where(eq(zoneGraduates.id, recordId))
        .limit(1);

      if (!record.length) {
        return NextResponse.json(
          { error: "Graduate record not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        record: record[0],
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Graduate search POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
