import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const results = await db
      .select({
        id: users.id,
        name: users.name,
        // email: users.email,
        type: users.type,
        // accountStatus: users.accountStatus,
        // isDeactivated: users.isDeactivated,
        // lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        // updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.type, "BLW_ZONE"));

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
