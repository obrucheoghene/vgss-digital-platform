// src/app/api/admin/create-account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createUserAccount } from "@/lib/utils/user-management";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is VGSS_OFFICE
    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, username, type, password } = await req.json();

    // Validate required fields
    if (!name || !username || !type) {
      return NextResponse.json(
        { error: "Name, username, and account type are required" },
        { status: 400 }
      );
    }

    // Validate username (no spaces, reasonable length)
    if (username.trim().length < 3 || /\s/.test(username)) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters and contain no spaces" },
        { status: 400 }
      );
    }

    // Validate account type
    const validTypes = ["BLW_ZONE", "SERVICE_DEPARTMENT", "VGSS_OFFICE"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid account type" },
        { status: 400 }
      );
    }

    // Create the account
    const result = await createUserAccount({
      name,
      username,
      type,
      password: password || "VgssTemp123",
      createdBy: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: result.user,
    });
  } catch (error) {
    console.error("Account creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
