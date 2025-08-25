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

    const { name, email, type, password } = await req.json();

    // Validate required fields
    if (!name || !email || !type) {
      return NextResponse.json(
        { error: "Name, email, and account type are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate account type
    const validTypes = ["BLW_ZONE", "MINISTRY_OFFICE", "VGSS_OFFICE"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid account type" },
        { status: 400 }
      );
    }

    // Create the account
    const result = await createUserAccount({
      name,
      email,
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
