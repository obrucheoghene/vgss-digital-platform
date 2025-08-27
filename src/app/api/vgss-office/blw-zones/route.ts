import { NextRequest, NextResponse } from "next/server";
import { graduateData, users, zoneGraduates } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { count, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const [
      blwZoneResult,
      zoneGraduateUploadCountResult,
      zoneRegisterGraduateCountResult,
    ] = await Promise.all([
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          type: users.type,
          accountStatus: users.accountStatus,
          isDeactivated: users.isDeactivated,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.type, "BLW_ZONE")),

      db
        .select({
          zoneId: zoneGraduates.userId,
          count: count(),
        })
        .from(zoneGraduates)
        .groupBy(zoneGraduates.userId),

      db
        .select({
          zoneId: graduateData.blwZoneId,
          count: count(),
        })
        .from(graduateData)
        .groupBy(graduateData.blwZoneId),
    ]);

    const results = blwZoneResult.map((zone) => ({
      ...zone,
      totalGraduatesUploaded:
        zoneGraduateUploadCountResult.find((value) => value.zoneId === zone.id)
          ?.count || 0,
      registeredGraduates:
        zoneRegisterGraduateCountResult.find(
          (value) => value.zoneId === zone.id
        )?.count || 0,
    }));

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.log("BLW Zone Request Failed", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
