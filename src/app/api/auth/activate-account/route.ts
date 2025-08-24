// src/app/api/auth/activate-account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if account is already activated
    if (session.user.accountStatus === "active") {
      return NextResponse.json(
        { error: "Account is already activated" },
        { status: 400 }
      );
    }

    const { newPassword } = await req.json();

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user account
    await db
      .update(users)
      .set({
        password: hashedPassword,
        accountStatus: "active",
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Account activated successfully",
    });
  } catch (error) {
    console.error("Account activation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
