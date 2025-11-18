// src/app/api/blw-zone/upload-graduates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { zoneGraduates } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { uploadGraduateSchema } from "@/lib/utils/validators";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is BLW_ZONE
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const values = uploadGraduateSchema.parse(data);

    // Check for duplicate (same name, fellowship, and zone)
    const existing = await db
      .select()
      .from(zoneGraduates)
      .where(
        and(
          eq(zoneGraduates.userId, session.user.id),
          eq(zoneGraduates.graduatePhoneNumber, values.graduatePhoneNumber)
        )
      )
      .limit(1);

    if (existing.length) throw new Error("Duplicate Graduate record");

    // Insert new record
    await db
      .insert(zoneGraduates)
      .values({ ...values, userId: session.user.id });

    return NextResponse.json({
      success: true,
      message: `Upload completed:`,
    });
  } catch (error) {
    console.error("Graduate upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
