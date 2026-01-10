// src/app/api/graduate/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { zoneGraduates, users } from "@/lib/db/schema";
import { ilike, or, and, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const gender = searchParams.get("gender") as "MALE" | "FEMALE";
    const zone = searchParams.get("zone") || "";
    const phoneNumber = searchParams.get("phoneNumber") || "";
    const surname = searchParams.get("surname") || "";

    console.log({ gender, phoneNumber, surname, zone });
    console.log({ query });

    // Add fellowship filter if specified
    // if (fellowship && fellowship !== "all") {
    //   searchConditions.push(eq(zoneGraduates.nameOfFellowship, fellowship));
    // }

    // Execute search with joins to get zone information
    const results = await db
      .select({
        id: zoneGraduates.id,
        graduateFirstname: zoneGraduates.graduateFirstname,
        graduateSurname: zoneGraduates.graduateSurname,
        graduateGender: zoneGraduates.graduateGender,
        graduatePhoneNumber: zoneGraduates.graduatePhoneNumber,
        nameOfUniversity: zoneGraduates.nameOfUniversity,
        courseOfStudy: zoneGraduates.courseOfStudy,
        graduationYear: zoneGraduates.graduationYear,
        chapterId: zoneGraduates.chapterId,
        nameOfZonalPastor: zoneGraduates.nameOfZonalPastor,
        nameOfChapterPastor: zoneGraduates.nameOfChapterPastor,
        phoneNumberOfChapterPastor: zoneGraduates.phoneNumberOfChapterPastor,
        kingschatIDOfChapterPastor: zoneGraduates.kingschatIDOfChapterPastor,
        isRegistered: zoneGraduates.isRegistered,
        registeredAt: zoneGraduates.registeredAt,
        createdAt: zoneGraduates.createdAt,
        // Zone information
        zoneName: users.name,
        // zoneEmail: users.email,
      })
      .from(zoneGraduates)
      .leftJoin(users, eq(zoneGraduates.userId, users.id))
      .where(
        and(
          eq(users.id, zone),
          eq(zoneGraduates.graduateSurname, surname)
          // eq(zoneGraduates.graduatePhoneNumber, phoneNumber)
          // eq(zoneGraduates.graduateGender, gender)
        )
      )
      .limit(50) // Limit results to prevent overwhelming responses
      .orderBy(zoneGraduates.createdAt);

    // Format results for frontend
    const formattedResults = results.map((result) => ({
      id: result.id,
      graduateFirstname: result.graduateFirstname,
      graduateSurname: result.graduateSurname,
      graduateGender: result.graduateGender,
      graduatePhoneNumber: result.graduatePhoneNumber,
      nameOfUniversity: result.nameOfUniversity,
      courseOfStudy: result.courseOfStudy,
      graduationYear: result.graduationYear,
      chapterId: result.chapterId,
      nameOfZonalPastor: result.nameOfZonalPastor,
      nameOfChapterPastor: result.nameOfChapterPastor,
      phoneNumberOfChapterPastor: result.phoneNumberOfChapterPastor,
      kingschatIDOfChapterPastor: result.kingschatIDOfChapterPastor,
      isRegistered: result.isRegistered,
      registeredAt: result.registeredAt,
      createdAt: result.createdAt,
      zoneName: result.zoneName || "Unknown Zone",
    }));

    return NextResponse.json({
      success: true,
      results: formattedResults,
      count: formattedResults.length,
    });
  } catch (error) {
    console.error("Graduate search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
